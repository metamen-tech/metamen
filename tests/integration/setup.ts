/**
 * Setup para tests de integración contra Supabase local.
 * Se conecta vía DATABASE_URL directo (pg Pool).
 *
 * @module tests/integration/setup
 */
import { Pool, type QueryResult, type QueryResultRow } from 'pg';
import { afterAll, beforeAll } from 'vitest';

const DATABASE_URL =
  process.env['DATABASE_URL'] ??
  'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 5,
});

/**
 * Ejecuta una query SQL contra la base de datos de test.
 * @param sql - Query SQL a ejecutar
 * @param params - Parámetros para consulta parametrizada
 * @returns Resultado de la query
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: readonly unknown[] = [],
): Promise<QueryResult<T>> {
  return pool.query<T>(sql, params as unknown[]);
}

/** ID del usuario principal de test (EL_RASTAS) */
export const TEST_USER_ID = 'a0000001-0000-0000-0000-000000000001';

/** Día base para tests */
export const TEST_DAY = 100;

/**
 * Resetea avatar_states y wallets a valores iniciales para el usuario de test.
 * Limpia daily_tasks y daily_logs del día de test.
 */
export async function resetTestData(): Promise<void> {
  // Resetear avatar_states
  await query(
    `UPDATE avatar_states SET
      aura_lvl = 0.00, jawline_lvl = 0.00, wealth_lvl = 0.00,
      physique_lvl = 0.00, social_lvl = 0.00, env_lvl = 1,
      health_points = 5, max_health_points = 10, current_level = 1,
      current_day = 0, total_days_completed = 0,
      streak_days = 0, max_streak_days = 0, death_count = 0,
      current_btc_multiplier = 1.00, version = 1
    WHERE user_id = $1`,
    [TEST_USER_ID],
  );

  // Resetear wallet
  await query(
    `UPDATE wallets SET
      btc_balance = 0, total_earned = 0, total_spent = 0,
      today_earned = 0, daily_cap = 2000,
      last_reset_date = CURRENT_DATE, version = 1
    WHERE user_id = $1`,
    [TEST_USER_ID],
  );

  // Limpiar tareas y logs del día de test
  await query(
    `DELETE FROM daily_tasks WHERE user_id = $1 AND day_number = $2`,
    [TEST_USER_ID, TEST_DAY],
  );
  await query(
    `DELETE FROM daily_logs WHERE user_id = $1 AND day_number = $2`,
    [TEST_USER_ID, TEST_DAY],
  );
}

/**
 * Crea las 17 daily_tasks pendientes para el usuario de test en el día de test.
 */
export async function createTestDailyTasks(): Promise<void> {
  const categories = [
    'meditation', 'thanks', 'posture', 'wake_early',
    'facial', 'voice', 'cold_shower',
    'skill_learning', 'focus_work', 'reading',
    'strength', 'cardio', 'hydration',
    'talk_friend', 'family', 'kegel', 'journal',
  ] as const;

  for (const category of categories) {
    await query(
      `INSERT INTO daily_tasks (user_id, category, day_number, btc_reward)
       VALUES ($1, $2, $3, (SELECT btc_base FROM task_vector_config WHERE category = $2))
       ON CONFLICT (user_id, category, day_number) DO NOTHING`,
      [TEST_USER_ID, category, TEST_DAY],
    );
  }
}

// ── Hooks globales ──────────────────────────────────────────

beforeAll(async () => {
  // Verificar conexión a la base de datos
  const result = await query<{ ok: number }>('SELECT 1 AS ok');
  if (result.rows[0]?.ok !== 1) {
    throw new Error('No se pudo conectar a la base de datos de test');
  }
});

afterAll(async () => {
  await pool.end();
});
