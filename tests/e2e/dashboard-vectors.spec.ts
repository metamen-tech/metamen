import { test, expect } from '@playwright/test';

/**
 * E2E — Dashboard: Radar chart de vectores.
 *
 * @description Verifica que el radar chart renderiza los 6 vectores
 *   con sus colores y labels correctos.
 *   Estos tests se activarán cuando la UI del Dashboard se implemente
 *   en Caja MVP-06.
 *
 * @see docs/07_UIUX.md — Dashboard layout con radar chart
 * @see src/lib/core/vectors/constants.ts — Definición de vectores
 */

/** Vectores del juego con sus colores Tailwind asociados */
const VECTORS = [
  { name: 'AURA', color: 'purple-500' },
  { name: 'JAWLINE', color: 'cyan-500' },
  { name: 'WEALTH', color: 'yellow-500' },
  { name: 'PHYSIQUE', color: 'red-500' },
  { name: 'SOCIAL', color: 'orange-500' },
  { name: 'ENV', color: 'green-500' },
] as const;

test.describe('Dashboard — Vectores Radar Chart', () => {
  // TODO: Activar cuando exista la UI del Dashboard (Caja MVP-06)
  test.skip();

  test('radar chart renderiza sin errores', async ({ page }) => {
    await page.goto('/dashboard');

    // Verificar que el contenedor del radar chart es visible
    const radarChart = page.getByTestId('vector-radar-chart');
    await expect(radarChart).toBeVisible();
  });

  test('radar chart muestra los 6 labels de vectores', async ({ page }) => {
    await page.goto('/dashboard');

    for (const vector of VECTORS) {
      await expect(
        page.getByTestId(`vector-label-${vector.name.toLowerCase()}`),
      ).toBeVisible();
    }
  });

  test('cada vector label muestra su nombre', async ({ page }) => {
    await page.goto('/dashboard');

    for (const vector of VECTORS) {
      const label = page.getByTestId(
        `vector-label-${vector.name.toLowerCase()}`,
      );
      await expect(label).toContainText(vector.name);
    }
  });

  test('radar chart tiene 6 ejes', async ({ page }) => {
    await page.goto('/dashboard');

    // Verificar que existen 6 ejes en el SVG del radar
    const axes = page.locator('[data-testid="vector-radar-chart"] [data-axis]');
    await expect(axes).toHaveCount(6);
  });

  test('cada vector tiene su color asignado', async ({ page }) => {
    await page.goto('/dashboard');

    for (const vector of VECTORS) {
      const segment = page.getByTestId(
        `vector-segment-${vector.name.toLowerCase()}`,
      );
      await expect(segment).toBeVisible();
      // Verificar que el atributo data-color coincide
      await expect(segment).toHaveAttribute('data-color', vector.color);
    }
  });
});
