import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para METAMEN100.
 *
 * @description 3 browsers (Chromium, Firefox, WebKit), webServer con `pnpm dev`,
 *   retry automático en CI, screenshots on failure, y trace on-first-retry.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /** Directorio de tests E2E */
  testDir: './tests/e2e',

  /** Ejecutar tests en paralelo */
  fullyParallel: true,

  /** Prohibir `test.only` en CI para evitar commits accidentales */
  forbidOnly: !!process.env.CI,

  /** Reintentar 2 veces en CI, 0 en local */
  retries: process.env.CI ? 2 : 0,

  /** 1 worker en CI para estabilidad, sin especificar en local (auto) */
  ...(process.env.CI ? { workers: 1 } : {}),

  /** Reporter HTML genera reporte visual en playwright-report/ */
  reporter: 'html',

  /** Timeout de 30 segundos por test */
  timeout: 30_000,

  use: {
    /** URL base para navegación relativa */
    baseURL: 'http://localhost:3000',

    /** Capturar trace en primer reintento para debugging */
    trace: 'on-first-retry',

    /** Screenshots solo en caso de fallo */
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /** Servidor de desarrollo automático */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
