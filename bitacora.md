# METAMEN100 — BITÁCORA DE PROYECTO

# ══════════════════════════════════════════════════════════════

# Este documento es el ESTADO VIVO del proyecto.

# Todo agente DEBE leerlo al inicio de cada sesión.

# Todo agente DEBE actualizarlo después de cada tarea completada.

# ══════════════════════════════════════════════════════════════

## ESTADO GENERAL

| Campo                   | Valor                                                    |
| ----------------------- | -------------------------------------------------------- |
| Fase actual             | MVP v1.0                                                 |
| Caja en curso           | **CAJA MVP-02: Infraestructura**                         |
| Última tarea completada | `02.4.1` — Workflow CI principal con unit tests          |
| Próxima tarea           | `02.4.2` — Integration tests con Supabase local          |
| Bloqueadores            | Ninguno                                                  |
| Fecha inicio proyecto   | 2026-02-21                                               |
| Último commit           | `42dc2f8` — ci(config)                                   |
| Branch                  | main                                                     |

## MAPA DE PROGRESO

```
CAJA MVP-02: Infraestructura     [▓▓▓▓▓▓▓░░░] 17/96  ← EN CURSO
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
- **Commit**: `ef911d2` — feat(lint): configure ESLint 9 flat config with security and import ordering
- **Notas**: Adaptación de compatibilidad: `@next/eslint-plugin-next` fijado a `~15.1.12` para evitar conflicto con Next.js 15. Se ajustó `import-x/order` para no romper imports existentes sin tocar `src/`.

### [02.2.2] — Configurar Prettier con Tailwind plugin

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 01:32
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `.prettierrc`, `.prettierignore`, `.editorconfig`, `package.json`, `pnpm-lock.yaml` y archivos reformateados por `prettier --write .`
- **Tests**: N/A (tarea de configuración)
- **Validación**: `pnpm format:check` exit 0 ✅; `pnpm lint` exit 0 ✅; `pnpm build` exit 0 ✅; `pnpm type-check` exit 0 ✅
- **Commit**: `dc4023a` — chore(format): configure Prettier with Tailwind plugin and EditorConfig
- **Notas**: Se instaló `prettier-plugin-tailwindcss` y se agregaron scripts `format` y `format:check` en `package.json`.

### [02.2.1-HF1] — Fix warning de detección del plugin Next en ESLint flat config

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 01:47
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `eslint.config.mjs`, `bitacora.md`
- **Tests**: N/A (ajuste de configuración)
- **Validación**: `pnpm lint` exit 0 ✅ y sin warning `The Next.js plugin was not detected...`
- **Commit**: `c3de3dc` — fix(02.2.1): remove eslint config ignores for next plugin detection
- **Notas**: Se removieron `*.config.mjs` y `*.config.js` del bloque `ignores` para que `next lint` pueda detectar `@next/next` al resolver la config.

### [02.2.3] — Instalar dependencias linting y knip

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 02:04
- **Tipo**: [BASH]
- **Archivos creados/modificados**: `knip.config.ts`, `eslint.config.mjs`, `package.json`, `pnpm-lock.yaml`, `bitacora.md`
- **Tests**: N/A (tarea de tooling)
- **Validación**: `pnpm ls --dev --depth=0` confirma deps requeridas ✅; `pnpm knip` ejecuta (reporta findings esperados, sin crash) ✅; `pnpm knip` detecta `src/test-dead-code-temp.ts` ✅; `pnpm lint` exit 0 ✅; `pnpm build` exit 0 ✅; `pnpm type-check` exit 0 ✅; `pnpm format:check` exit 0 ✅; limpieza de temporales ✅
- **Commit**: `8ad17ca` — chore(dx): add eslint-config-prettier bridge and knip dead code detector
- **Notas**: `eslint-config-prettier` ya estaba instalado; se agregó únicamente `knip`. Se integró `eslint-config-prettier` como último config efectivo antes de `ignores`.

### [02.2.4] — Verificar pipeline linting completo

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 02:22
- **Tipo**: [TEST]
- **Archivos creados/modificados**: `docs/LINTING.md`, `bitacora.md`
- **Tests**: N/A (verificación de tooling)
- **Validación**: CHECK 1 `pnpm lint` exit 0 ✅; CHECK 2 `pnpm format:check` exit 0 ✅; CHECK 3 security plugin detecta `eval` + `object injection` en archivo temporal ✅; CHECK 4 `import-x/order` detecta imports desordenados ✅; CHECK 5 `pnpm knip` ejecuta sin crash y findings esperados sin falsos positivos críticos ✅; limpieza de temporales ✅; `pnpm build` exit 0 ✅; `pnpm type-check` exit 0 ✅
- **Commit**: `cf8b30f` — docs(lint): add linting pipeline verification and troubleshooting guide
- **Notas**: Se creó guía de troubleshooting en `docs/LINTING.md`. `pnpm format:check` requiere mantener `tsconfig.json` formateado durante la verificación y luego restaurarlo para no persistir cambios fuera de alcance.

### [02.3.1] — Configurar Husky con pre-commit y pre-push

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 08:20
- **Tipo**: [SETUP]
- **Archivos creados/modificados**: `.husky/pre-commit`, `.husky/pre-push`, `package.json`, `pnpm-lock.yaml`, `bitacora.md`
- **Tests**: N/A (tarea de hooks y configuración)
- **Validación**: `.husky/` creado con `pre-commit` y `pre-push` ✅; `pre-commit` ejecuta `pnpm lint-staged` y auto-corrige formato en commit de prueba ✅; `pre-push` ejecuta `pnpm type-check` (opción A, sin bloquear por Vitest aún no operativo) ✅; `pnpm lint` exit 0 ✅; `pnpm build` exit 0 ✅; `pnpm type-check` exit 0 ✅; `pnpm format:check` exit 0 ✅; sin archivos temporales ✅
- **Commit**: `fbb4173` — chore(git): configure Husky pre-commit with lint-staged and pre-push type-check
- **Notas**: Se implementó pre-push solo con `pnpm type-check` por fase temprana del bloque (test runner se integrará en tarea posterior).

### [02.3.2] — Configurar commitlint con scopes del proyecto

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 08:50
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `commitlint.config.js`, `.husky/commit-msg`, `package.json`, `pnpm-lock.yaml`
- **Tests**: N/A (tarea de tooling)
- **Validación**: `echo "feat(auth): add login page" | npx commitlint` exit 0 ✅; `echo "fix: correct typo" | npx commitlint` warning scope-empty + exit 0 ✅; `echo "invalid commit message" | npx commitlint` exit 1 ✅; `echo "feat(nonexistent): bad scope" | npx commitlint` exit 1 ✅; hook real `git commit -m "bad message"` rechazado y commit válido aceptado ✅; `pnpm lint`/`pnpm build`/`pnpm type-check` exit 0 ✅
- **Commit**: `4e8d98d` — chore(git): configure commitlint with project-aligned scopes
- **Notas**: Se mantuvieron intactos `.husky/pre-commit` y `.husky/pre-push`.

### [02.3.3] — Documentar convenciones Git y branch protection

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 08:57
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `.github/BRANCH_NAMING.md`
- **Tests**: N/A (tarea de documentación/infra)
- **Validación**: Documento creado con formato de ramas + tabla de types + reglas de protección ✅; rama `develop` creada desde `main` y publicada en `origin` ✅; branch protection aplicada por `gh api` en `main` (`lint`,`type-check`,`build`, 1 aprobación) y `develop` (`lint`,`type-check`, 1 aprobación) ✅; `pnpm lint`/`pnpm build`/`pnpm type-check` exit 0 ✅
- **Commit**: `dcf682a` — docs(git): add branch naming conventions and protection rules
- **Notas**: En Caja 02 se siguió usando push directo a `main` con bypass de admin para continuidad operativa.

### [02.4.1] — Workflow CI principal con unit tests

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-24 09:51
- **Tipo**: [CONFIG]
- **Archivos creados/modificados**: `.github/workflows/ci.yml`, `vitest.config.ts`, `tests/setup.ts`, `src/lib/core/__tests__/placeholder.test.ts`, `.husky/pre-push`, `package.json`, `pnpm-lock.yaml`
- **Tests**: `pnpm test --run` (2 passed, 0 failed); `pnpm test:coverage` (2 passed, 0 failed)
- **Validación**: Local: `pnpm test --run` exit 0 ✅; `pnpm test:coverage` exit 0 ✅; `pnpm lint` exit 0 ✅; `pnpm type-check` exit 0 ✅; `pnpm build` exit 0 ✅; hook `pre-push` ejecuta `pnpm type-check && pnpm test --run` ✅. Remoto: workflow `CI` run `22358578811` exitoso con jobs `lint`, `type-check`, `unit-test (shard 1/2)`, `unit-test (shard 2/2)`, `build` ✅
- **Commit**: `42dc2f8` — ci(config): add github actions ci workflow with vitest and sharded unit tests
- **Notas**: Se fijó stack de testing compatible con Node `v20.18.0` usando Vitest 2.x y jsdom 25.x.

---

## ISSUES Y DEUDA TÉCNICA

<!-- Registrar aquí problemas encontrados que no se resuelven en la tarea actual -->

- **[DEPENDENCIAS] 3 Subdependencias Transitivas Deprecated**: `glob@10.5.0`, `node-domexception@1.0.0`, `serialize-error-cjs@0.1.4` reportan warnings al instalar. Se confirma mediante `pnpm why` que provienen internamente de las dependencias raíz `@supabase/ssr` e `inngest`. **No accionable:** El override explícito rompe la cadena interna. Se documenta como deuda técnica pasiva a la espera de que los dueños de los paquetes actualicen sus dependencias internas. Efecto nulo en producción o funcionalidad del motor.
- **[DEV-ENV] Resolución de `bash` en Windows**: En esta máquina, `bash.exe` por defecto apunta al launcher de WSL (`C:\Windows\System32\bash.exe`) y falla si no hay distro Linux configurada (`/bin/bash` no encontrado). **Mitigación**: ejecutar desde Git Bash o priorizar `C:\Program Files\Git\bin` en `PATH` para usar `pnpm verify`.
- **[PERF-DEV] HMR Turbopack por encima de objetivo**: Se midió HMR en `403ms` (objetivo <200ms) con warning `Slow filesystem detected` sobre `M:\proyectos\metamen_tech`. No bloquea la ejecución, pero afecta experiencia de desarrollo.
- **[LINT-NEXT][RESUELTO 2026-02-24]**: Se eliminó `*.config.mjs`/`*.config.js` de `ignores` en `eslint.config.mjs`; `next lint` vuelve a detectar correctamente el plugin `@next/next`.
- **[VITEST][WARN] CJS API de Vite deprecada**: Vitest 2.x muestra warning `The CJS build of Vite's Node API is deprecated` durante runs locales. **No bloqueante**: tests y CI pasan; seguimiento para migrar a stack ESM completo en iteración futura.

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
- 2026-02-24 01:47 — Hotfix 02.2.1-HF1: removidos ignores `*.config.mjs`/`*.config.js` en ESLint flat config para eliminar warning de detección del plugin Next.
- 2026-02-24 02:04 — Completada tarea 02.2.3: agregado `knip`, script `pnpm knip`, `knip.config.ts` y bridge final `eslint-config-prettier` en ESLint.
- 2026-02-24 02:22 — Completada tarea 02.2.4: verificación integral del pipeline (`lint`, `prettier`, `security`, `import order`, `knip`) y creación de `docs/LINTING.md`.
- 2026-02-24 02:30 — Sesión finalizada por solicitud del usuario. Estado y bitácora actualizados hasta este punto.
- 2026-02-24 08:20 — Completada tarea 02.3.1: Husky + lint-staged (`pre-commit`) y `pre-push` con `type-check`; validado auto-fix en commit de prueba y limpieza de temporales.
- 2026-02-24 08:50 — Completada tarea 02.3.2: commitlint + hook `commit-msg` con scopes del proyecto y validación de mensajes válidos/inválidos.
- 2026-02-24 08:57 — Completada tarea 02.3.3: documentación de branching + creación de `develop` + branch protection en `main/develop` por `gh api`.
- 2026-02-24 09:51 — Completada tarea 02.4.1: Vitest 2.x + workflow CI con sharding (2 shards) y ejecución exitosa en GitHub Actions (run `22358578811`).
