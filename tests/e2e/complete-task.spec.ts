import { test, expect } from '@playwright/test';

/**
 * E2E — Flow de completar tarea y verificar BTC.
 *
 * @description Usuario autenticado completa una tarea pendiente y
 *   verifica que el BTC earned se incrementa respetando el daily cap.
 *   Estos tests se activarán cuando la UI del Dashboard se implemente
 *   en Caja MVP-06.
 *
 * @see docs/05_GDD.md — Mecánica de tareas y recompensas
 * @see docs/04_DATA_MODEL.md — daily_tasks, wallets
 */

/** Las 17 categorías de tareas del juego */
const TASK_CATEGORIES = [
  'meditation',
  'thanks',
  'posture',
  'wake_early',
  'facial',
  'voice',
  'cold_shower',
  'skill_learning',
  'focus_work',
  'reading',
  'strength',
  'cardio',
  'hydration',
  'talk_friend',
  'family',
  'kegel',
  'journal',
] as const;

/** Daily cap de BTC según reglas del juego */
const DAILY_BTC_CAP = 2_000;

test.describe('Complete Task Flow', () => {
  // TODO: Activar cuando exista la UI del Dashboard (Caja MVP-06)
  test.skip();

  test('dashboard muestra lista de tareas pendientes', async ({ page }) => {
    await page.goto('/dashboard');

    // Verificar que la lista de tareas es visible
    const taskList = page.getByTestId('task-list');
    await expect(taskList).toBeVisible();

    // Verificar que al menos una tarea está presente
    const taskItems = page.getByTestId('task-item');
    await expect(taskItems.first()).toBeVisible();
  });

  test('tareas muestran categorías del juego', async ({ page }) => {
    await page.goto('/dashboard');

    // Verificar que al menos algunas categorías conocidas aparecen
    const taskList = page.getByTestId('task-list');
    await expect(taskList).toBeVisible();

    // El texto de al menos una categoría debe estar presente
    const pageText = await page.textContent('body');
    const hasKnownCategory = TASK_CATEGORIES.some((cat) =>
      pageText?.toLowerCase().includes(cat.replace('_', ' ')),
    );
    expect(hasKnownCategory).toBe(true);
  });

  test('completar tarea incrementa BTC earned', async ({ page }) => {
    await page.goto('/dashboard');

    // Capturar BTC actual
    const btcBefore = await page
      .getByTestId('btc-balance')
      .textContent();
    const btcValueBefore = parseInt(btcBefore?.replace(/\D/g, '') ?? '0', 10);

    // Seleccionar primera tarea pendiente
    await page.getByTestId('task-item').first().click();

    // Marcar como completada
    await page.getByTestId('complete-task-button').click();

    // Esperar actualización del UI
    await page.waitForTimeout(1_000);

    // Verificar que BTC se incrementó
    const btcAfter = await page
      .getByTestId('btc-balance')
      .textContent();
    const btcValueAfter = parseInt(btcAfter?.replace(/\D/g, '') ?? '0', 10);

    expect(btcValueAfter).toBeGreaterThan(btcValueBefore);
  });

  test('BTC no excede daily cap de 2000', async ({ page }) => {
    await page.goto('/dashboard');

    // Verificar widget de BTC daily
    const todayEarned = await page
      .getByTestId('btc-today-earned')
      .textContent();
    const todayValue = parseInt(todayEarned?.replace(/\D/g, '') ?? '0', 10);

    expect(todayValue).toBeLessThanOrEqual(DAILY_BTC_CAP);
  });
});
