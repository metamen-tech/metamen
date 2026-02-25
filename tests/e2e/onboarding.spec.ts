import { test, expect } from '@playwright/test';

/**
 * E2E — Flow de Onboarding completo.
 *
 * @description Registro → Onboarding → Selección de personaje.
 *   Estos tests se activarán cuando la UI de Auth/Onboarding se implemente
 *   en Caja MVP-05.
 *
 * @see docs/01_PRD.md — Flujo de onboarding
 * @see docs/07_UIUX.md — Pantallas de onboarding
 */

/** Nombres de los 6 personajes disponibles */
const CHARACTERS = [
  'EL_RASTAS',
  'EL_GUARRO',
  'EL_PECAS',
  'EL_GREÑAS',
  'EL_GUERO',
  'EL_LIC',
] as const;

test.describe('Onboarding Flow', () => {
  // TODO: Activar cuando exista la UI de registro (Caja MVP-05)
  test.skip();

  test('navega a /register y muestra formulario de registro', async ({
    page,
  }) => {
    await page.goto('/register');

    // Verificar que el formulario de registro es visible
    await expect(page.getByRole('heading', { name: /registro/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('completa registro y redirige a onboarding', async ({ page }) => {
    await page.goto('/register');

    // Rellenar formulario
    await page.fill('input[type="email"]', `test-${Date.now()}@metamen100.test`);
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');

    // Verificar redirección a onboarding
    await expect(page).toHaveURL(/onboarding/);
  });

  test('Quick Quiz: responder 3 preguntas muestra recomendación', async ({
    page,
  }) => {
    await page.goto('/onboarding');

    // Responder pregunta 1
    await page.click('[data-testid="quiz-option-0"]');
    await page.click('[data-testid="quiz-next"]');

    // Responder pregunta 2
    await page.click('[data-testid="quiz-option-1"]');
    await page.click('[data-testid="quiz-next"]');

    // Responder pregunta 3
    await page.click('[data-testid="quiz-option-2"]');
    await page.click('[data-testid="quiz-next"]');

    // Verificar que aparece la recomendación de personaje
    await expect(
      page.getByTestId('character-recommendation'),
    ).toBeVisible();
  });

  test('Character Confirm: muestra 6 thumbnails de personajes', async ({
    page,
  }) => {
    await page.goto('/onboarding');

    // Verificar que los 6 thumbnails son visibles
    for (const character of CHARACTERS) {
      await expect(
        page.getByTestId(`character-thumb-${character}`),
      ).toBeVisible();
    }
  });

  test('botón Continuar deshabilitado antes de seleccionar personaje', async ({
    page,
  }) => {
    await page.goto('/onboarding');

    const continueButton = page.getByRole('button', { name: /continuar/i });
    await expect(continueButton).toBeDisabled();
  });

  test('seleccionar personaje habilita botón Continuar', async ({ page }) => {
    await page.goto('/onboarding');

    // Click en el primer personaje
    await page.click(`[data-testid="character-thumb-${CHARACTERS[0]}"]`);

    // Verificar selección visual
    await expect(
      page.locator(`[data-testid="character-thumb-${CHARACTERS[0]}"][data-selected="true"]`),
    ).toBeVisible();

    // Verificar que el botón se habilita
    const continueButton = page.getByRole('button', { name: /continuar/i });
    await expect(continueButton).toBeEnabled();
  });

  test('completar onboarding redirige al dashboard', async ({ page }) => {
    await page.goto('/onboarding');

    // Seleccionar personaje
    await page.click(`[data-testid="character-thumb-${CHARACTERS[0]}"]`);

    // Continuar
    await page.click('button:has-text("Continuar")');

    // Verificar redirección al dashboard
    await expect(page).toHaveURL(/dashboard/);
  });
});
