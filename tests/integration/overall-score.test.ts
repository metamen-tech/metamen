/**
 * Tests de integración para fn_calculate_overall_score y fn_calculate_level.
 * Valida la fórmula ponderada y el dual gate de niveles.
 *
 * @module tests/integration/overall-score.test
 */
import { describe, test, expect } from 'vitest';
import { query } from './setup';

describe('fn_calculate_overall_score', () => {
  test('todos vectores en 0: score = 0.50 (ENV×5×0.10 con ENV=1)', async () => {
    const result = await query<{ fn_calculate_overall_score: string }>(
      `SELECT fn_calculate_overall_score(0, 0, 0, 0, 0, 1)`,
    );
    // 0 + 0 + 0 + 0 + 0 + (1×5)×0.10 = 0.50
    expect(parseFloat(result.rows[0]?.fn_calculate_overall_score ?? '0')).toBe(
      0.5,
    );
  });

  test('todos vectores en 50, ENV=10: score = 50.00', async () => {
    const result = await query<{ fn_calculate_overall_score: string }>(
      `SELECT fn_calculate_overall_score(50, 50, 50, 50, 50, 10)`,
    );
    // 10 + 7.5 + 10 + 10 + 7.5 + 5 = 50.00
    expect(parseFloat(result.rows[0]?.fn_calculate_overall_score ?? '0')).toBe(
      50.0,
    );
  });

  test('pesos ponderados correctos — solo AURA=50', async () => {
    const result = await query<{ fn_calculate_overall_score: string }>(
      `SELECT fn_calculate_overall_score(50, 0, 0, 0, 0, 1)`,
    );
    // 50×0.20 + 0 + 0 + 0 + 0 + (1×5)×0.10 = 10 + 0.50 = 10.50
    expect(parseFloat(result.rows[0]?.fn_calculate_overall_score ?? '0')).toBe(
      10.5,
    );
  });

  test('pesos ponderados correctos — solo JAWLINE=50', async () => {
    const result = await query<{ fn_calculate_overall_score: string }>(
      `SELECT fn_calculate_overall_score(0, 50, 0, 0, 0, 1)`,
    );
    // 0 + 50×0.15 + 0 + 0 + 0 + 0.50 = 7.50 + 0.50 = 8.00
    expect(parseFloat(result.rows[0]?.fn_calculate_overall_score ?? '0')).toBe(
      8.0,
    );
  });
});

describe('fn_calculate_level (dual gate)', () => {
  test('score=4.0, day=3 → nivel 2 (REFUGIADO)', async () => {
    const result = await query<{ fn_calculate_level: number }>(
      `SELECT fn_calculate_level(4.0, 3)`,
    );
    expect(result.rows[0]?.fn_calculate_level).toBe(2);
  });

  test('score=4.0, day=2 → nivel 1 (no cumple min_day)', async () => {
    const result = await query<{ fn_calculate_level: number }>(
      `SELECT fn_calculate_level(4.0, 2)`,
    );
    expect(result.rows[0]?.fn_calculate_level).toBe(1);
  });

  test('score=3.0, day=3 → nivel 2 (cumple ambos gates)', async () => {
    const result = await query<{ fn_calculate_level: number }>(
      `SELECT fn_calculate_level(3.0, 3)`,
    );
    // score >= 2.00 AND day >= 3 → nivel 2
    expect(result.rows[0]?.fn_calculate_level).toBe(2);
  });

  test('score=1.5, day=3 → nivel 1 (no cumple min_score para nivel 2)', async () => {
    const result = await query<{ fn_calculate_level: number }>(
      `SELECT fn_calculate_level(1.5, 3)`,
    );
    expect(result.rows[0]?.fn_calculate_level).toBe(1);
  });

  test('score=49.0, day=200 → nivel 12 (SEMI-DIOS)', async () => {
    const result = await query<{ fn_calculate_level: number }>(
      `SELECT fn_calculate_level(49.0, 200)`,
    );
    expect(result.rows[0]?.fn_calculate_level).toBe(12);
  });

  test('score=45.0, day=179 → nivel 11 (no cumple min_day para 12)', async () => {
    const result = await query<{ fn_calculate_level: number }>(
      `SELECT fn_calculate_level(45.0, 179)`,
    );
    // day 179 < 180, así que no nivel 12; pero 45 >= 40 y 179 >= 150 → nivel 11
    expect(result.rows[0]?.fn_calculate_level).toBe(11);
  });
});
