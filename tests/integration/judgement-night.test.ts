/**
 * Tests de integración para fn_process_judgement_night.
 * Valida juicio nocturno: HP, streak, muerte, daily_log.
 *
 * @module tests/integration/judgement-night.test
 */
import { describe, test, expect, beforeEach } from 'vitest';
import {
  query,
  resetTestData,
  createTestDailyTasks,
  TEST_USER_ID,
  TEST_DAY,
} from './setup';

/** Tipo del resultado de fn_process_judgement_night */
interface JudgementNightResult {
  result_status: string;
  completion_pct: string;
  hp_change: number;
  new_hp: number;
  new_streak: number;
  death_occurred: boolean;
  btc_lost: number;
}

/**
 * Completa N tareas del día usando fn_complete_task_transaction.
 * @param count - Cantidad de tareas a completar
 */
async function completeNTasks(count: number): Promise<void> {
  const categories = [
    'meditation', 'thanks', 'posture', 'wake_early',
    'facial', 'voice', 'cold_shower',
    'skill_learning', 'focus_work', 'reading',
    'strength', 'cardio', 'hydration',
    'talk_friend', 'family', 'kegel', 'journal',
  ] as const;

  for (let i = 0; i < count && i < categories.length; i++) {
    await query(
      `SELECT * FROM fn_complete_task_transaction($1, $2, $3)`,
      [TEST_USER_ID, categories[i], TEST_DAY],
    );
  }
}

describe('fn_process_judgement_night', () => {
  beforeEach(async () => {
    await resetTestData();
    await createTestDailyTasks();
  });

  test('día ≥80% completado: +1 HP, +1 streak', async () => {
    // Completar 14 de 17 tareas (82.4%)
    await completeNTasks(14);

    const result = await query<JudgementNightResult>(
      `SELECT * FROM fn_process_judgement_night($1, $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row).toBeDefined();
    expect(row?.result_status).toBe('completed');
    expect(row?.hp_change).toBe(1);
    expect(row?.new_hp).toBe(6); // 5 + 1
    expect(row?.new_streak).toBe(1); // 0 + 1
    expect(row?.death_occurred).toBe(false);
  });

  test('día <80% completado: -1 HP, streak reset', async () => {
    // Setear streak previo
    await query(
      `UPDATE avatar_states SET streak_days = 5 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    // Completar 13 de 17 tareas (76.5%)
    await completeNTasks(13);

    const result = await query<JudgementNightResult>(
      `SELECT * FROM fn_process_judgement_night($1, $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row?.result_status).toBe('failed');
    expect(row?.hp_change).toBe(-1);
    expect(row?.new_hp).toBe(4); // 5 - 1
    expect(row?.new_streak).toBe(0); // reset
  });

  test('HP llega a 0: death penalty aplicada', async () => {
    // Setear estado pre-muerte
    await query(
      `UPDATE avatar_states SET
        health_points = 1, aura_lvl = 20.00
       WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    await query(
      `UPDATE wallets SET btc_balance = 1000 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    // 0 tareas completadas → fail → HP 1 → 0 → muerte
    const result = await query<JudgementNightResult>(
      `SELECT * FROM fn_process_judgement_night($1, $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row?.death_occurred).toBe(true);
    // Primera muerte: 30% de 1000 = 300
    expect(row?.btc_lost).toBe(300);
    expect(row?.new_hp).toBe(5); // respawn

    // Verificar vectores reseteados
    const avatar = await query<{
      aura_lvl: string;
      jawline_lvl: string;
      wealth_lvl: string;
      physique_lvl: string;
      social_lvl: string;
      env_lvl: number;
      death_count: number;
    }>(
      `SELECT aura_lvl, jawline_lvl, wealth_lvl, physique_lvl, social_lvl, env_lvl, death_count
       FROM avatar_states WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    const a = avatar.rows[0];
    // Aura preservada: 30% de 20.00 = 6.00
    expect(parseFloat(a?.aura_lvl ?? '0')).toBe(6.0);
    expect(parseFloat(a?.jawline_lvl ?? '0')).toBe(0.0);
    expect(parseFloat(a?.wealth_lvl ?? '0')).toBe(0.0);
    expect(parseFloat(a?.physique_lvl ?? '0')).toBe(0.0);
    expect(parseFloat(a?.social_lvl ?? '0')).toBe(0.0);
    expect(a?.env_lvl).toBe(1);
    expect(a?.death_count).toBe(1);

    // Verificar wallet
    const wallet = await query<{ btc_balance: number }>(
      `SELECT btc_balance FROM wallets WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    expect(wallet.rows[0]?.btc_balance).toBe(700); // 1000 - 300
  });

  test('segunda muerte: 40% BTC lost', async () => {
    await query(
      `UPDATE avatar_states SET health_points = 1, death_count = 1 WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    await query(
      `UPDATE wallets SET btc_balance = 1000 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    const result = await query<JudgementNightResult>(
      `SELECT * FROM fn_process_judgement_night($1, $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    expect(result.rows[0]?.btc_lost).toBe(400); // 40% de 1000
  });

  test('tercera+ muerte: 50% BTC lost', async () => {
    await query(
      `UPDATE avatar_states SET health_points = 1, death_count = 2 WHERE user_id = $1`,
      [TEST_USER_ID],
    );
    await query(
      `UPDATE wallets SET btc_balance = 1000 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    const result = await query<JudgementNightResult>(
      `SELECT * FROM fn_process_judgement_night($1, $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    expect(result.rows[0]?.btc_lost).toBe(500); // 50% de 1000
  });

  test('HP no supera max_health_points', async () => {
    // Setear HP al máximo
    await query(
      `UPDATE avatar_states SET health_points = 10, max_health_points = 10 WHERE user_id = $1`,
      [TEST_USER_ID],
    );

    // Completar día exitoso
    await completeNTasks(17);

    const result = await query<JudgementNightResult>(
      `SELECT * FROM fn_process_judgement_night($1, $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    const row = result.rows[0];
    expect(row?.result_status).toBe('completed');
    // HP no debe exceder max (10)
    expect(row?.new_hp).toBeLessThanOrEqual(10);
  });

  test('daily_log se crea correctamente', async () => {
    // Completar todas las tareas
    await completeNTasks(17);

    await query(
      `SELECT * FROM fn_process_judgement_night($1, $2)`,
      [TEST_USER_ID, TEST_DAY],
    );

    // Verificar daily_log creado
    const logs = await query<{
      day_number: number;
      day_status: string;
      completion_pct: string;
      tasks_completed: number;
      tasks_total: number;
    }>(
      `SELECT day_number, day_status, completion_pct, tasks_completed, tasks_total
       FROM daily_logs WHERE user_id = $1 AND day_number = $2`,
      [TEST_USER_ID, TEST_DAY],
    );

    expect(logs.rows).toHaveLength(1);
    const log = logs.rows[0];
    expect(log?.day_status).toBe('completed');
    expect(parseFloat(log?.completion_pct ?? '0')).toBe(100.0);
    expect(log?.tasks_completed).toBe(17);
    expect(log?.tasks_total).toBe(17);
  });
});
