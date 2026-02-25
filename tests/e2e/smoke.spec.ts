import { test, expect } from '@playwright/test';

/**
 * Tests de humo — verifican que la app carga correctamente.
 *
 * @description Estos tests se ejecutan siempre y validan que el servidor
 *   Next.js responde y renderiza la landing page sin errores.
 */
test.describe('Smoke Tests', () => {
  test('la landing page carga con status 200', async ({ page }) => {
    const response = await page.goto('/');

    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test('la landing page renderiza contenido principal', async ({ page }) => {
    await page.goto('/');

    // Verificar que el body tiene contenido visible
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verificar que no hay errores de consola críticos
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Recargar para capturar errores de consola
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filtrar errores conocidos/esperados (favicon, red, TLS de WebKit en CI)
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes('favicon') &&
        !err.includes('404') &&
        !err.includes('Failed to load resource') &&
        !err.includes('TLS handshake'),
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('la página tiene un título válido', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});
