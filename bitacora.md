# METAMEN100 — BITÁCORA DE PROYECTO

# ══════════════════════════════════════════════════════════════

# Este documento es el ESTADO VIVO del proyecto.

# Todo agente DEBE leerlo al inicio de cada sesión.

# Todo agente DEBE actualizarlo después de cada tarea completada.

# ══════════════════════════════════════════════════════════════

## ESTADO GENERAL

| Campo                   | Valor                                              |
| ----------------------- | -------------------------------------------------- |
| Fase actual             | MVP v1.0                                           |
| Caja en curso           | **CAJA MVP-02: Infraestructura**                   |
| Última tarea completada | `02.2.2` — Configurar Prettier con Tailwind plugin |
| Próxima tarea           | `02.2.3` — Instalar dependencias linting y knip    |
| Bloqueadores            | Ninguno                                            |
| Fecha inicio proyecto   | 2026-02-21                                         |
| Último commit           | `38cc5ae` — test(verify)                           |
| Branch                  | main                                               |

## MAPA DE PROGRESO

```
CAJA MVP-02: Infraestructura     [▓▓▓▓░░░░░░] 11/96  ← EN CURSO
CAJA MVP-03: Base de Datos       [░░░░░░░░░░] 0/??
CAJA MVP-04: Motor Core          [░░░░░░░░░░] 0/??
CAJA MVP-05: Auth/Onboarding     [░░░░░░░░░░] 0/??
CAJA MVP-06: Dashboard/UI        [░░░░░░░░░░] 0/??
CAJA MVP-07: Arsenal (Arq)       [░░░░░░░░░░] 0/??
CAJA MVP-08: IA Generativa       [░░░░░░░░░░] 0/??
CAJA MVP-10: Stripe/Pagos        [░░░░░░░░░░] 0/??
CAJA MVP-11: Email               [░░░░░░░░░░] 0/??
CAJA MVP-12: Observabilidad      [░░░░░░░░░░] 0/??
CAJA MVP-13: Launch              [░░░░░░░░░░] 0/??
```

## TECH STACK CONFIGURADO

| Servicio      | Status         | Notas                                 |
| ------------- | -------------- | ------------------------------------- |
| Next.js 15    | ✅ Configurado | Next.js 15.1.12 (cumple >=15.1)       |
| Supabase      | ⬜ Pendiente   | Necesita proyecto creado en dashboard |
| Stripe        | ⬜ Pendiente   | Test mode, 3 precios                  |
| Gemini API    | ⬜ Pendiente   | Google AI Studio key                  |
| Resend        | ⬜ Pendiente   | Dominio por verificar                 |
| Upstash Redis | ⬜ Pendiente   | Free tier                             |
| Inngest       | ⬜ Pendiente   |                                       |
| Vercel        | ⬜ Pendiente   | Conectar repo                         |
| Sentry        | ⬜ Pendiente   | Free tier                             |
| PostHog       | ⬜ Pendiente   | Free tier                             |

## CREDENCIALES OBTENIDAS

| Variable                           | Status |
| ---------------------------------- | ------ |
| NEXT_PUBLIC_SUPABASE_URL           | ⬜     |
| NEXT_PUBLIC_SUPABASE_ANON_KEY      | ⬜     |
| SUPABASE_SERVICE_ROLE_KEY          | ⬜     |
| STRIPE_SECRET_KEY                  | ⬜     |
| STRIPE_WEBHOOK_SECRET              | ⬜     |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | ⬜     |
| STRIPE_PRICE_MONTHLY               | ⬜     |
| STRIPE_PRICE_PROTOCOL              | ⬜     |
| STRIPE_PRICE_ANNUAL                | ⬜     |
| GEMINI_API_KEY                     | ⬜     |
| RESEND_API_KEY                     | ⬜     |
| UPSTASH_REDIS_REST_URL             | ⬜     |
| UPSTASH_REDIS_REST_TOKEN           | ⬜     |
| INNGEST_EVENT_KEY                  | ⬜     |
| INNGEST_SIGNING_KEY                | ⬜     |
| NEXT_PUBLIC_APP_URL                | ⬜     |
| SENTRY_DSN                         | ⬜     |
| NEXT_PUBLIC_POSTHOG_KEY            | ⬜     |

## DECISIONES DE ARQUITECTURA (Referencia rápida)

- **UI agrupada por 5 vectores** (AURA, JAWLINE, WEALTH, PHYSIQUE, SOCIAL) — no 4 arquetipos
- **Calendario semanal FIJO** de 17 tareas hardcodeado
- **ENV es vector derivado** del nivel del personaje (nivel 1 = env 1)
- **JN a las 00:00** hora local, procesado por cron Inngest cada hora
- **Mercy Rule 80%**: ≥80% completion = no DOWNs, no pérdida de hearts
- **0% completion = NO genera imagen** (protege costos Gemini)
- **3ra muerte = hibernación** de la cuenta (JN deja de procesarla)
- **DOWN = -UP simétrico**, fijos (sin diminishing returns)
- **UP tiene diminishing returns**: max(0.25, 0.90^(rep-1))
- **Imagen base estática** pre-generada por personaje (antes del primer JN)
- **Consistency Anchor**: reference image + identity tokens + negative prompt
- **Precios Founders**: $9.99/mes, $29.99/100 días, $79.00/año USD
- **Onboarding**: Quiz 4 pantallas → Selección Avatar (libre) → Juramento → Dashboard
- **Personaje irreversible** una vez seleccionado

---

## REGISTRO DE TAREAS COMPLETADAS

<!--
FORMATO POR TAREA:
### [ID] — Título
- **Estado**: ✅ COMPLETADA | ⚠️ PARCIAL | ❌ FALLIDA
- **Fecha**: YYYY-MM-DD HH:MM
- **Archivos creados/modificados**: ruta1, ruta2
- **Tests**: ruta.test.ts (X passed, 0 failed) | N/A si no aplica
- **Validación**: Resultado del criterio de validación de la tarea
- **Commit**: hash corto + mensaje
- **Notas**: Observaciones, decisiones, problemas encontrados
-->

### [02.1.1] — Instalar Node.js 20 LTS y pnpm 9

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-22 13:00
- **Tipo**: [MANUAL]
- **Archivos creados/modificados**: Ninguno (verificación de entorno)
- **Tests**: N/A
- **Validación**: `node -v` → v20.18.0 ✅; `pnpm -v` → 10.28.2 ✅ (cumple >=9.0.0)
- **Commit**: N/A (tarea manual, sin cambios de código)
- **Notas**: pnpm 10.x es backward-compatible con el requisito >=9.0.0. Corepack disponible.

### [02.1.2] — Crear estructura completa de carpetas del proyecto

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 00:10
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `src/**/.gitkeep`, `supabase/migrations/.gitkeep`, `tests/**/.gitkeep`, `scripts/.gitkeep`, `.vscode/.gitkeep`, `.github/**/.gitkeep`
- **Tests**: N/A (tarea de estructura)
- **Validación**: Estructura de carpetas creada según Tech Spec §4; `src/lib/email` ausente ✅; `67` archivos `.gitkeep` creados ✅; sin archivos `.ts/.tsx/.js/.jsx` nuevos ✅
- **Commit**: `37402f4` — feat(scaffold): create full project folder structure per Tech Spec §4
- **Notas**: Commit aislado solo para scaffold; cambios preexistentes en `docs/` se mantuvieron fuera del commit.

### [02.1.3] — Inicializar proyecto Next.js con dependencias

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 00:55
- **Tipo**: [BASH]
- **Archivos creados/modificados**: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `.eslintrc.json`, `eslint.config.mjs`
- **Tests**: N/A (tarea de inicialización/configuración)
- **Validación**: `pnpm install` exit 0 ✅; `pnpm dev` levantando en `http://localhost:3000` ✅; `pnpm lint` y `pnpm type-check` sin errores ✅; scripts requeridos 16/16 ✅; versiones `next/react/react-dom` con tilde (`~15.1.0`, `~19.0.0`, `~19.0.0`) ✅; sin dependencias prohibidas (`resend`, `replicate`, `dall-e`, `fal.ai`) ✅
- **Commit**: `b13d129` — feat(init): initialize Next.js 15 with full dependency set per Constantes §4.1
- **Notas**: Se eliminó configuración ESLint plana incompatible (`eslint.config.mjs`) y se dejó `.eslintrc.json` para compatibilidad con `next lint`.

### [02.1.4] — Configurar TypeScript ultra-strict con path aliases

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-23 20:33
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `tsconfig.json`, `src/lib/core/vectors/index.ts`, `src/lib/core/levels/index.ts`, `src/lib/core/economy/index.ts`, `src/components/ui/index.ts`, `src/components/vectors/index.ts`, `src/hooks/index.ts`, `src/types/index.ts`
- **Tests**: N/A (tarea de configuración)
- **Validación**: TypeScript en modo ultra-strict configurado; aliases `@/*` y específicos por capa activos; barrels creados según especificación; `pnpm tsc --noEmit` sin errores ✅
- **Commit**: `7fbc5e0` — chore(ts): configure ultra-strict TypeScript with path aliases and barrel exports
- **Notas**: Se respetó la regla de capas en `src/lib/core/`.

### [02.1.5] — Configurar Next.js con seguridad CSP completa

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-23 20:51
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `next.config.ts`
- **Tests**: N/A (tarea de configuración)
- **Validación**: CSP y security headers endurecidos según spec; `pnpm build` exitoso; headers verificables en runtime (`content-security-policy`, `x-frame-options`, `strict-transport-security`) ✅
- **Commit**: `10a6667` — feat(security): configure CSP headers and hardened next.config.ts per Security Spec §13
- **Notas**: Configuración preparada para entorno dev/prod sin exponer orígenes no permitidos.

### [02.1.6] — Configurar Design System completo en Tailwind

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-23 21:08
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `tailwind.config.ts`, `package.json`, `pnpm-lock.yaml`
- **Tests**: N/A (tarea de configuración)
- **Validación**: Tokens de color/tipografía/animación del Design System cargados en Tailwind; clases de vectores/raridades/niveles resuelven; `pnpm build` sin errores ✅
- **Commit**: `f29b240` — feat(design): configure complete Design System tokens in Tailwind per UI/UX Spec §1
- **Notas**: Plugins de Tailwind (`typography`, `forms`, `tailwindcss-animate`) integrados.

### [02.1.7] — Crear CSS custom properties para design tokens

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-23 22:45
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `src/app/globals.css`, `tailwind.config.ts`
- **Tests**: N/A (tarea de configuración)
- **Validación**: Variables CSS en `:root` como single source of truth; `tailwind.config.ts` consume tokens vía `var(--color-...)`; dark mode único tema; `pnpm build` exitoso ✅
- **Commit**: `bfa2447` — refactor(tokens): extract Design System colors to CSS custom properties as single source of truth
- **Notas**: Se restauró `tsconfig.json` tras build (modificación automática de Next.js en dev/build).

### [02.1.8] — Verificar Turbopack en desarrollo

- **Estado**: ⚠️ PARCIAL
- **Fecha**: 2026-02-23 23:35
- **Tipo**: [TEST]
- **Archivos creados/modificados**: Ninguno
- **Tests**: N/A
- **Validación**: Turbopack activo ✅; cold start Turbopack `3000ms` vs baseline `3700ms` (18.9% más rápido) ✅; HMR observado `403ms` (objetivo `<200ms` no cumplido) ❌; sin incompatibilidades de plugins Tailwind ✅
- **Commit**: N/A (tarea de verificación, sin cambios de código)
- **Notas**: Se observó warning de entorno `Slow filesystem detected` en unidad `M:\`, probable impacto en latencia de HMR.

### [02.1.9] — Verificar setup completo del proyecto

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 00:07
- **Tipo**: [TEST]
- **Archivos creados/modificados**: `scripts/verify-setup.sh`, `package.json`
- **Tests**: `pnpm verify` (10 passed, 0 failed)
- **Validación**: Script de verificación integral (10 checks) operativo; checks independientes; resumen final X/10; exit code correcto; cleanup de procesos dev y restauración de `tsconfig.json` ✅
- **Commit**: `38cc5ae` — test(verify): add setup verification script with 10 comprehensive checks
- **Notas**: En PowerShell con `bash.exe` apuntando a WSL sin distro, `pnpm verify` requiere priorizar Git Bash en `PATH`.

### [02.2.1] — Configurar ESLint 9 con seguridad e import order

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 00:58
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `eslint.config.mjs`, `package.json`, `pnpm-lock.yaml`, `bitacora.md`; eliminado `.eslintrc.json`
- **Tests**: N/A (tarea de configuración)
- **Validación**: `pnpm lint` exit 0 ✅; `pnpm build` exit 0 ✅; `pnpm type-check` exit 0 ✅; regla `security/detect-eval-with-expression` detecta `eval()` en archivo temporal ✅; regla `import-x/order` detecta imports desordenados en archivo temporal ✅; limpieza de temporales y restauración de `tsconfig.json` ✅
- **Commit**: pendiente (se registra en commit de esta tarea)
- **Notas**: Adaptación de compatibilidad: `@next/eslint-plugin-next` fijado a `~15.1.12` para evitar conflicto con Next.js 15. Se ajustó `import-x/order` para no romper imports existentes sin tocar `src/`.

### [02.2.2] — Configurar Prettier con Tailwind plugin

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 01:32
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `.prettierrc`, `.prettierignore`, `.editorconfig`, `package.json`, `pnpm-lock.yaml` y archivos reformateados por `prettier --write .`
- **Tests**: N/A (tarea de configuración)
- **Validación**: `pnpm format:check` exit 0 ✅; `pnpm lint` exit 0 ✅; `pnpm build` exit 0 ✅; `pnpm type-check` exit 0 ✅
- **Commit**: pendiente (se registra en commit de esta tarea)
- **Notas**: Se instaló `prettier-plugin-tailwindcss` y se agregaron scripts `format` y `format:check` en `package.json`.

---

## ISSUES Y DEUDA TÉCNICA

<!-- Registrar aquí problemas encontrados que no se resuelven en la tarea actual -->

- **[DEPENDENCIAS] 3 Subdependencias Transitivas Deprecated**: `glob@10.5.0`, `node-domexception@1.0.0`, `serialize-error-cjs@0.1.4` reportan warnings al instalar. Se confirma mediante `pnpm why` que provienen internamente de las dependencias raíz `@supabase/ssr` e `inngest`. **No accionable:** El override explícito rompe la cadena interna. Se documenta como deuda técnica pasiva a la espera de que los dueños de los paquetes actualicen sus dependencias internas. Efecto nulo en producción o funcionalidad del motor.
- **[DEV-ENV] Resolución de `bash` en Windows**: En esta máquina, `bash.exe` por defecto apunta al launcher de WSL (`C:\Windows\System32\bash.exe`) y falla si no hay distro Linux configurada (`/bin/bash` no encontrado). **Mitigación**: ejecutar desde Git Bash o priorizar `C:\Program Files\Git\bin` en `PATH` para usar `pnpm verify`.
- **[PERF-DEV] HMR Turbopack por encima de objetivo**: Se midió HMR en `403ms` (objetivo <200ms) con warning `Slow filesystem detected` sobre `M:\proyectos\metamen_tech`. No bloquea la ejecución, pero afecta experiencia de desarrollo.
- **[LINT-NEXT] Aviso de detección de plugin Next con flat config**: `next lint` muestra warning no bloqueante (`The Next.js plugin was not detected in your ESLint configuration`) aun con `next/core-web-vitals` cargado mediante `FlatCompat`. Lint/buid/type-check pasan; revisar migración nativa flat config de Next cuando el stack se estabilice.

---

## NOTAS DE SESIÓN

<!-- Cada sesión de trabajo debe agregar una entrada aquí -->

- 2026-02-22 13:00 — Verificada tarea 02.1.1 (Node.js v20.18.0 + pnpm 10.28.2).
- 2026-02-22 13:03 — Completada tarea 02.1.2 (scaffold Next.js + validación de arranque y estructura).
- 2026-02-22 16:35 — Completada tarea 02.1.3 (package.json completo: engines, 15 scripts, 27+17 deps).
- 2026-02-22 20:00 — [FIX] Warning de `supabase.EXE` resuelto autorizando los scripts de construcción de dependencias con `pnpm approve-builds supabase`. Las 3 dependencias deprecated se auditaron y se documentaron como deuda técnica inalterable en la bitácora. Instalación impecable.
- 2026-02-24 00:10 — Rehecha tarea 02.1.2: estructura completa de carpetas + `.gitkeep` (67 archivos), commit `37402f4`.
- 2026-02-24 00:55 — Rehecha tarea 02.1.3: inicialización Next.js 15 con dependencias completas, validación `install/dev/lint/type-check`, commit `b13d129`.
- 2026-02-23 22:25 — Sesión finalizada por solicitud del usuario. Se canceló la implementación en curso y se cerró la sesión sin nuevos cambios de tarea.
- 2026-02-23 20:33 — Completada tarea 02.1.4: TypeScript ultra-strict + path aliases + barrels, commit `7fbc5e0`.
- 2026-02-23 20:51 — Completada tarea 02.1.5: hardening de seguridad y CSP en Next.js, commit `10a6667`.
- 2026-02-23 21:08 — Completada tarea 02.1.6: Design System completo en Tailwind, commit `f29b240`.
- 2026-02-23 22:45 — Completada tarea 02.1.7: extracción de tokens de color a CSS custom properties, commit `bfa2447`.
- 2026-02-23 23:35 — Ejecutada tarea 02.1.8: benchmark Turbopack/webpack y verificación HMR (resultado parcial por HMR >200ms).
- 2026-02-24 00:07 — Completada tarea 02.1.9: script `pnpm verify` con 10 checks y cleanup automático, commit `38cc5ae`.
- 2026-02-24 00:58 — Completada tarea 02.2.1: migración a ESLint 9 flat config (`eslint.config.mjs`) con `typescript-eslint`, `eslint-plugin-security` e `import-x`; verificados lint/build/type-check y detección de reglas con archivos temporales.
- 2026-02-24 01:32 — Completada tarea 02.2.2: configuración de Prettier + plugin Tailwind + EditorConfig; ejecutados `format:check/format/lint/build/type-check`.
