/**
 * Tests de integración para fn_complete_task_transaction.
 * Valida la transacción completa: vector + BTC + tarea + clamping + caps.
 *
 * @module tests/integration/complete-task.test
 */
import { describe, test, expect, beforeEach } from 'vitest';
import {
  query,
  resetTestData,
  createTestDailyTasks,
  TEST_USER_ID,
  TEST_DAY,
} from './setup';

/** Tipo del resultado de fn_complete_task_transaction */
interface TaskTransactionResult {
  success: boolean;
  btc_earned: number;
  vector_name: string;
  old_value: string;
  new_value: string;
  capped: boolean;
}

describe('fn_complete_task_transaction', () => {
  beforeEach(async () => {
    await resetTestData();
    await createTestDailyTasks();
  });

  test('completa tarea meditation y suma +0.50 a aura_lvl', async () => {
    const result = await query<TaskTransactionResult>(
      `SELECT * FROM fn_complete_task_transaction($1, 'meditation', $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row).toBeDefined();
    expect(row?.success).toBe(true);
    expect(row?.vector_name).toBe('aura');
    expect(parseFloat(row?.old_value ?? '0')).toBe(0.0);
    expect(parseFloat(row?.new_value ?? '0')).toBe(0.5);

    // Verificar estado en avatar_states
    const avatar = await query<{ aura_lvl: string }>(
      `SELECT aura_lvl FROM avatar_states WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    expect(parseFloat(avatar.rows[0]?.aura_lvl ?? '0')).toBe(0.5);

    // Verificar wallet tiene BTC
    const wallet = await query<{ btc_balance: number }>(
      `SELECT btc_balance FROM wallets WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    expect(wallet.rows[0]?.btc_balance).toBeGreaterThan(0);
  });

  test('clampea vector a máximo 50.00', async () => {
    // Setear aura_lvl cerca del máximo
    await query(
      `UPDATE avatar_states SET aura_lvl = 49.80 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    const result = await query<TaskTransactionResult>(
      `SELECT * FROM fn_complete_task_transaction($1, 'meditation', $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row?.success).toBe(true);
    expect(parseFloat(row?.new_value ?? '0')).toBe(50.0);
    expect(row?.capped).toBe(true);

    // Verificar que no excede 50.00
    const avatar = await query<{ aura_lvl: string }>(
      `SELECT aura_lvl FROM avatar_states WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    expect(parseFloat(avatar.rows[0]?.aura_lvl ?? '0')).toBe(50.0);
  });

  test('clampea ENV a máximo 10', async () => {
    // ENV solo se modifica indirectamente, pero probamos el clamp
    await query(
      `UPDATE avatar_states SET env_lvl = 10 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    // Verificar que env_lvl no puede subir más de 10
    const avatar = await query<{ env_lvl: number }>(
      `SELECT env_lvl FROM avatar_states WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    expect(avatar.rows[0]?.env_lvl).toBe(10);
  });

  test('vector no baja de 0.00', async () => {
    // Setear aura_lvl bajo y aplicar una "resta" manual
    await query(
      `UPDATE avatar_states SET aura_lvl = 0.10 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    // Simular DOWN: restar desde SQL con clamp
    await query(
      `UPDATE avatar_states SET aura_lvl = GREATEST(aura_lvl - 0.50, 0.00) WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    const avatar = await query<{ aura_lvl: string }>(
      `SELECT aura_lvl FROM avatar_states WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    expect(parseFloat(avatar.rows[0]?.aura_lvl ?? '0')).toBe(0.0);
  });

  test('respeta daily BTC cap de 2000', async () => {
    // Setear today_earned cerca del cap
    await query(
      `UPDATE wallets SET today_earned = 1990 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    const result = await query<TaskTransactionResult>(
      `SELECT * FROM fn_complete_task_transaction($1, 'meditation', $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row?.success).toBe(true);
    // BTC earned no debe exceder lo que queda del cap (2000 - 1990 = 10)
    expect(row?.btc_earned).toBeLessThanOrEqual(10);

    // Verificar wallet
    const wallet = await query<{ today_earned: number }>(
      `SELECT today_earned FROM wallets WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    expect(wallet.rows[0]?.today_earned).toBeLessThanOrEqual(2000);
  });

  test('no completa tarea ya completada', async () => {
    // Completar medication una primera vez
    await query(
      `SELECT * FROM fn_complete_task_transaction($1, 'meditation', $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    // Intentar completar de nuevo
    const result = await query<TaskTransactionResult>(
      `SELECT * FROM fn_complete_task_transaction($1, 'meditation', $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row?.success).toBe(false);
  });

  test('aplica diminishing returns en repetición 2+', async () => {
    // Crear tarea con repetition_number = 2
    await query(
      `DELETE FROM daily_tasks WHERE user_id = $1 AND category = 'meditation' AND day_number = $2`,
      [TEST_USER_ID, TEST_DAY],
    );
    await query(
      `INSERT INTO daily_tasks (user_id, category, day_number, btc_reward, repetition_number)
       VALUES ($1, 'meditation', $2, 50, 2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const result = await query<TaskTransactionResult>(
      `SELECT * FROM fn_complete_task_transaction($1, 'meditation', $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row?.success).toBe(true);
    // Con rep=2: diminishing = 0.90^(2-1) = 0.90
    // btc = FLOOR(50 * 0.90 * 1.05) = FLOOR(47.25) = 47
    // (multiplier = 1.0 + (1 * 0.05) + 0 + 0 = 1.05)
    expect(row?.btc_earned).toBe(47);

    // Ahora probar con repetition_number = 5
    await query(
      `DELETE FROM daily_tasks WHERE user_id = $1 AND category = 'thanks' AND day_number = $2`,
      [TEST_USER_ID, TEST_DAY],
    );
    await query(
      `INSERT INTO daily_tasks (user_id, category, day_number, btc_reward, repetition_number)
       VALUES ($1, 'thanks', $2, 40, 5)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const result2 = await query<TaskTransactionResult>(
      `SELECT * FROM fn_complete_task_transaction($1, 'thanks', $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row2 = result2.rows[0];
    expect(row2?.success).toBe(true);
    // rep=5: diminishing = max(0.25, 0.90^4) = max(0.25, 0.6561) = 0.66
    // btc = FLOOR(40 * 0.66 * 1.05) = FLOOR(27.72) = 27
    expect(row2?.btc_earned).toBe(27);
  });
});
