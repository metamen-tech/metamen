
# ══════════════════════════════════════════════════════════════════════════════

# CAJA 02: INFRAESTRUCTURA Y DEVOPS — DEFINITIVA v4.0

# ══════════════════════════════════════════════════════════════════════════════

# METAMEN100 · Lead DevOps & Infrastructure Engineer

# Generado: 2026-02-22 · Fuente de verdad: Constantes Maestras v2.0.0 + PRD v2.0.0 + ADRs v2.0.0 + Tech Spec v2.0.0

# ══════════════════════════════════════════════════════════════════════════════

---

## META

| Campo | Valor |
| --- | --- |
| Tareas previas (v3.0) | 95 (8 subcajas) |
| Tareas definitivas (v4.0) | **96** (8 subcajas, atomizadas, alineadas con Constantes Maestras v2.0.0) |
| Distribución | 62 [AUTO/SCRIPT] · 22 [MANUAL] · 12 [CONFIG] |
| Fixes de alineación integrados | 18 (discrepancias con documentación v2.0.0) |
| Bloques de código | **0** — solo directivas imperativas y firmas |
| Servicios externos | 7: Supabase, Stripe, Gemini 2.5 Flash, Upstash Redis, Inngest, Sentry, PostHog |
| Fuente de verdad de constantes | Constantes Maestras v2.0.0 (PRIORIDAD ABSOLUTA) |
| Override del propietario | Upstash Redis SE MANTIENE a pesar de que la documentación v2.0.0 lo descarta |

---

## CONVENCIONES

- **[AUTO/SCRIPT]**: Tarea ejecutable via comando terminal, script o archivo de configuración
- **[MANUAL]**: Paso que requiere intervención humana (Dashboard, consola web, cuenta externa)
- **[CONFIG]**: Archivo de configuración puro (JSON, YAML, TOML)
- **🔒 AUDIT FIX**: Corrección proveniente de auditoría previa
- **🔄 ALINEACIÓN v2.0.0**: Corrección por discrepancia con Constantes Maestras v2.0.0
- **🆕 NUEVA**: Tarea nueva no presente en versión anterior
- **Criticidad**: ALTA = bloquea flujo · MEDIA = funcionalidad degradada · BAJA = mejora

---

## ORDEN DE EJECUCIÓN

```
02.1 Configuración del Proyecto → Node, Next.js, TS strict, Tailwind, design tokens, deps
02.2 Linting y Formatting       → ESLint 9, Prettier, import order, knip
02.3 Git Hooks                   → Husky, lint-staged, commitlint, branch naming
02.4 CI/CD Pipeline              → GitHub Actions, Vitest, Playwright, security, Lighthouse
02.5 Variables de Entorno        → .env, Zod validation, Vercel, Inngest vars
02.6 Servicios Externos          → Supabase, Stripe, Gemini, Upstash, Inngest, Sentry, PostHog
02.7 Herramientas de Desarrollo  → Scripts, VSCode, seed, reset, health check, Supabase local
02.8 Estructura y Documentación  → Carpetas, tipos base, docs, changelog
```

---

## GRAFO DE DEPENDENCIAS (Ruta Crítica)

```
02.1.1 (Node/pnpm) --> 02.1.2 (Next.js init) --> 02.1.3-02.1.9 --> 02.1.10-02.1.12 (verify)
                                                                          |
                    +---------------------------+--------------------------+------------------+
                    |                           |                          |                  |
               02.2.* (linting)           02.5.1-02.5.4 (env)       02.4.1 (CI base)   02.8.1 (carpetas)
                    |                           |                          |                  |
               02.3.* (hooks)            02.6.* (servicios)         02.4.2-02.4.14      02.8.2-02.8.7
                                               |
            +-------+-------+--------+--------+--------+-------+-------+
            |       |       |        |        |        |       |       |
        Supabase  Stripe  Gemini  Upstash  Inngest  Sentry  PostHog  Verify
        02.6.1-9  .10-14  .15-16  .17-20   .21-24   .25-26  .27-28  .29-30

PARALELIZABLES: Todas las cuentas MANUAL (02.6.1, 02.6.10, 02.6.15, 02.6.17, 02.6.21, 02.6.25, 02.6.27)
PARALELIZABLES: 02.2.*, 02.4.*, 02.8.* (tras 02.1.12)
PARALELIZABLES: 02.7.2-02.7.4 (VSCode configs, independientes)

CONSTANTES (Constantes Maestras v2.0.0):
├── VECTORES: AURA(0.20), JAWLINE(0.15), WEALTH(0.20), PHYSIQUE(0.20), SOCIAL(0.15), ENV(0.10) — rango 0-50
├── PERSONAJES: EL_RASTAS, EL_GUARRO, EL_PECAS, EL_GREÑAS, EL_GUERO, EL_LIC (base_avatar_id 1-6)
├── TASK CATEGORIES: 17 → AURA(4), JAWLINE(3), WEALTH(3), PHYSIQUE(3), SOCIAL(4)
├── TOOL_TYPES: 9 → meditation, focus_timer, lookmaxing, journal, logbook, kegel, posture, metagym, voice
├── NIVELES: 12 (10 protocolo + 2 post-game) → INDIGENTE a SEMI-DIOS
├── DAILY BTC CAP: 2,000
├── HEALTH: 5 inicial, 10 max base, 14 max expandido
└── COLORES: Elevación(3) + Accent Dual(5) + Semánticos(4) + Texto(4) + Vectores(6×2) + Niveles(5) + Rareza(4)
```

---

## ÍNDICE DE SUBCAJAS

| Subcaja | Nombre | Tareas | AUTO | MANUAL | CONFIG |
| --- | --- | --- | --- | --- | --- |
| 02.1 | Configuración del Proyecto | 12 | 10 | 1 | 1 |
| 02.2 | Linting y Formatting | 8 | 8 | 0 | 0 |
| 02.3 | Git Hooks | 5 | 4 | 0 | 1 |
| 02.4 | CI/CD Pipeline | 14 | 14 | 0 | 0 |
| 02.5 | Variables de Entorno | 7 | 4 | 2 | 1 |
| 02.6 | Servicios Externos | 30 | 13 | 14 | 3 |
| 02.7 | Herramientas de Desarrollo | 10 | 10 | 0 | 0 |
| 02.8 | Estructura y Documentación | 10 | 0 | 4 | 6 |
| **TOTAL** |  | **96** | **63** | **21** | **12** |

---

# ══════════════════════════════════════════════════════════════════════════════

# SUBCAJA 02.1: CONFIGURACIÓN DEL PROYECTO (12 tareas)

# ══════════════════════════════════════════════════════════════════════════════

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.1.1 | Instalar Node.js 20 LTS y pnpm 9 | [MANUAL] | Verificar `node --version` >= 20.0.0 y `pnpm --version` >= 9.0.0. Instalar desde [nodejs.org](http://nodejs.org) si ausente. Activar Corepack: `corepack enable`. | `node -v` muestra 20.x; `pnpm -v` muestra 9.x |
| 02.1.2 | Inicializar proyecto Next.js 15 | [AUTO/SCRIPT] | Ejecutar `pnpm create next-app@latest metamen100` con flags: `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm`. Validar Next.js >= 15.1, React 19, TypeScript 5.7. | `package.json` contiene `"next": "~15.1"` o superior; `pnpm dev` arranca en :3000 |
| 02.1.3 | Configurar package.json completo | [AUTO/SCRIPT] | Definir `engines` estrictos (node>=20, pnpm>=9). Agregar dependencias según Constantes Maestras v2.0.0 §4.1: Frontend (next, react, tailwindcss, framer-motion, cva, clsx, tailwind-merge, lucide-react, recharts, shadcn/ui, immer, zustand), Backend (@supabase/supabase-js, @supabase/ssr, inngest, bullmq, @google/generative-ai, stripe, zod, react-hook-form, @hookform/resolvers, date-fns, date-fns-tz, uuid, @upstash/redis, @upstash/ratelimit), Dev (typescript, vitest, fast-check, @testing-library/react, playwright, eslint, prettier, husky, supabase). Scripts: dev, build, start, lint, type-check, test, test:e2e, test:coverage, db:generate, db:seed, db:reset, analyze, clean, verify, inngest:dev. Fijar Next.js y React con tilde (~), NO caret (^). Configurar `pnpm.overrides` para sharp. Agregar `inngest-cli` en devDependencies. | `pnpm install` exit 0; todos los scripts existen; majors fijados con tilde |
| 02.1.4 | Configurar tsconfig.json ultra-strict | [AUTO/SCRIPT] | Habilitar: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`. Paths: `@/*` -> `./src/*`. Target: ES2022. moduleResolution: bundler. | `pnpm tsc --noEmit` compila sin errores |
| 02.1.5 | Configurar next.config.ts con CSP y seguridad | [AUTO/SCRIPT] | Migrar a TypeScript. CSP completo: default-src self, script-src para Stripe, connect-src para Supabase/Gemini/Stripe/Inngest/Upstash, img-src para Supabase Storage. HSTS 2 años. X-Frame-Options DENY. Permissions-Policy sin camera/microphone/geolocation. Image remotePatterns para *.[supabase.co](http://supabase.co) y Gemini. Turbopack en dev. Performance budget: 200KB*  • initial load (🔒 AUDIT FIX). NO referencia a Replicate ni [Fal.ai](http://Fal.ai) (Constantes Maestras §4.2 Prohibidas). | `pnpm build` completa; headers de seguridad verificables con `curl -I` |
| 02.1.6 | 🔄 Configurar tailwind.config.ts con Design System COMPLETO de Constantes Maestras v2.0.0 | [AUTO/SCRIPT] | **SISTEMA DE ELEVACIÓN (§2.1)**: bg-base `#0A0A0A`, bg-card `#1A1A1A`, bg-elevated `#2D2D2D`. **ACCENT DUAL (§2.2)**: accent-gold `#D4AF37`, accent-gold-hover `#B8941F`, accent-cta `#FF073A`, accent-cta-hover `#DC143C`, accent-active `#00E5FF`. **ESTADOS SEMÁNTICOS (§2.3)**: error `#FF0000`, success `#00FF88`, warning `#FFB800`, info `#00E5FF`. **TEXTO (§2.4)**: text-primary `#FFFFFF`, text-glow `#F8FFFF`, text-secondary `#B0B0B0`, text-disabled `#808080`. **VECTORES (§2.5)**: vector-aura primario `#9B59B6` secundario `#E8D5F2`, vector-jawline primario `#E74C3C` secundario `#FADBD8`, vector-wealth primario `#27AE60` secundario `#D5F5E3`, vector-physique primario `#E67E22` secundario `#FDEBD0`, vector-social primario `#3498DB` secundario `#D6EAF8`, vector-env primario `#1ABC9C` secundario `#D1F2EB`. **NIVELES (§2.6)**: level-low `#95A5A6` (1-3), level-mid `#8D6E63` (4-6), level-high `#3498DB` (7-9), level-elite `#D4AF37` (10-11), level-god `#9B59B6` (12, con glow). **RAREZA (§2.7)**: rarity-common `#95A5A6`, rarity-rare `#3498DB`, rarity-epic `#9B59B6`, rarity-legendary `#D4AF37` (con glow). **6 personajes** como tokens de color: avatar-rastas, avatar-guarro, avatar-pecas, avatar-greñas, avatar-guero, avatar-lic. Tipografía: Inter + JetBrains Mono. Keyframes: level-up, vector-pulse, bitcoin-collect, streak-fire, death-fade. Plugins: typography, forms, animate. | Clases custom (text-vector-aura, bg-accent-cta, text-level-god, bg-rarity-legendary, bg-bg-base, text-text-primary) resuelven sin error |
| 02.1.7 | Evaluar necesidad de PostCSS | [AUTO/SCRIPT] | Si Tailwind v4: verificar si postcss.config.js es necesario. Si Tailwind v3: configurar con autoprefixer SOLAMENTE. **NO incluir cssnano** (redundante con Next.js/Tailwind). Documentar decisión en comentario del archivo. (🔒 AUDIT FIX: eliminada redundancia PostCSS/cssnano). | Build produce CSS minificado; cssnano NO está en deps |
| 02.1.8 | Instalar dependencias y auditar | [AUTO/SCRIPT] | Ejecutar `pnpm install --frozen-lockfile` (CI) o `pnpm install` (dev). Validar 0 vulnerabilidades críticas con `pnpm audit --audit-level=critical`. Incluir todas las dependencias de Constantes Maestras §4.1: @google/generative-ai, inngest, @upstash/redis, @upstash/ratelimit, posthog-js, posthog-node. **NO incluir Resend** (Post-MVP per Constantes Maestras §3). **NO incluir Replicate, DALL-E, [Fal.ai](http://Fal.ai)** (§4.2 Prohibidas). | exit 0; pnpm-lock.yaml generado; audit sin críticas; `grep "resend" package.json` = 0 |
| 02.1.9 | Configurar path aliases y barrel exports | [CONFIG] | Definir aliases en tsconfig.json: `@/core/*` → `./src/lib/core/*`, `@/actions/*` → `./src/actions/*`, `@/components/*` → `./src/components/*`, `@/hooks/*` → `./src/hooks/*`, `@/types/*` → `./src/types/*`. Crear `index.ts` barrel en cada directorio principal. **Regla**: Layer N solo importa de Layer ≤ N-1. Sin dependencias circulares. Alineado con estructura de carpetas del Tech Spec v2.0.0 §4. | Imports con @ resuelven correctamente; 0 circular deps |
| 02.1.10 | Verificar Turbopack en desarrollo | [AUTO/SCRIPT] | Confirmar que `pnpm dev --turbopack` arranca sin errores. Verificar HMR funcional. Medir tiempos de cold start vs webpack. Documentar incompatibilidades conocidas. Si Turbopack no soporta algún plugin → fallback a webpack con nota. | `pnpm dev --turbopack` arranca en < 3s; HMR < 200ms |
| 02.1.11 | 🆕 Crear archivo de CSS custom properties para design tokens | [AUTO/SCRIPT] | `src/app/globals.css`: Definir todas las CSS custom properties de Constantes Maestras v2.0.0 §2 usando la notación oficial. **Elevación**: `--color-bg-base: #0A0A0A`, `--color-bg-card: #1A1A1A`, `--color-bg-elevated: #2D2D2D`. **Accent Dual**: `--color-accent-gold: #D4AF37`, `--color-accent-gold-hover: #B8941F`, `--color-accent-cta: #FF073A`, `--color-accent-cta-hover: #DC143C`, `--color-accent-active: #00E5FF`. **Semánticos**: `--color-error: #FF0000`, `--color-success: #00FF88`, `--color-warning: #FFB800`, `--color-info: #00E5FF`. **Texto**: `--color-text-primary: #FFFFFF`, `--color-text-glow: #F8FFFF`, `--color-text-secondary: #B0B0B0`, `--color-text-disabled: #808080`. **Vectores** (primario + secundario para cada uno de los 6). **Niveles** (5 rangos). **Rareza** (4 tipos). Referenciar estos custom properties en tailwind.config.ts para mantener single source of truth. Incluir dark mode como único tema (la app es dark-only). | Archivo existe; custom properties accesibles via `var(--color-bg-base)`; Tailwind las referencia |
| 02.1.12 | Verificar setup completo | [AUTO/SCRIPT] | Script que valida: (1) `pnpm dev` arranca, (2) `pnpm build` completa, (3) `pnpm tsc --noEmit` pasa, (4) TS strict activo, (5) Tailwind funcional con **6 vectores** (colores Constantes Maestras), **6 personajes**, **5 rangos de nivel**, **4 rarezas**, sistema de elevación, accent dual y semánticos, (6) CSP headers presentes, (7) bundle < 200KB, (8) aliases resuelven, (9) CSS custom properties definidas. | 9/9 checks pasan |

---

# ══════════════════════════════════════════════════════════════════════════════

# SUBCAJA 02.2: LINTING Y FORMATTING (8 tareas)

# ══════════════════════════════════════════════════════════════════════════════

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.2.1 | Configurar ESLint 9 flat config con plugin de seguridad | [AUTO/SCRIPT] | Crear `eslint.config.mjs` (flat config, NO .eslintrc). Incluir: @typescript-eslint/strict, **eslint-plugin-security** (detect-eval, detect-object-injection), react-hooks, next/core-web-vitals. Regla: `@typescript-eslint/no-explicit-any: error`. (🔒 AUDIT FIX: plugin-security agregado). | `pnpm lint` ejecuta; plugin-security detecta `eval()` |
| 02.2.2 | Configurar Prettier con plugin Tailwind | [AUTO/SCRIPT] | Crear `.prettierrc`: singleQuote true, semi true, trailingComma all, tabWidth 2, printWidth 100. Plugin prettier-plugin-tailwindcss para ordenar clases (incluyendo clases custom del design system completo de Constantes Maestras: vectores, niveles, rarezas, elevación, accents, semánticos). | `pnpm prettier --check src/` ejecuta |
| 02.2.3 | Configurar .prettierignore | [AUTO/SCRIPT] | Excluir: node_modules, .next, coverage, dist, pnpm-lock.yaml, *.min.js, supabase/migrations, .inngest/. | Archivos excluidos no son procesados |
| 02.2.4 | Configurar .editorconfig | [AUTO/SCRIPT] | indent_style space, indent_size 2, end_of_line lf, charset utf-8, trim_trailing_whitespace true. Override *.md: trim_trailing_whitespace false. | Archivo existe en raíz |
| 02.2.5 | Instalar dependencias de linting | [AUTO/SCRIPT] | devDependencies: eslint@^9, @typescript-eslint/parser, @typescript-eslint/eslint-plugin, eslint-plugin-security, eslint-plugin-react-hooks, eslint-config-prettier, prettier, prettier-plugin-tailwindcss, eslint-plugin-import-x, knip. | Todas en devDependencies |
| 02.2.6 | Configurar eslint-plugin-import-x para orden de imports | [AUTO/SCRIPT] | En eslint.config.mjs: habilitar eslint-plugin-import-x con grupos de imports ordenados según convención del Tech Spec v2.0.0 §9: (1) React (react, react-dom), (2) Librerías externas (next, framer-motion, zustand, stripe, inngest, @supabase, @upstash, @google/generative-ai), (3) Componentes internos (@/components), (4) Hooks internos (@/hooks), (5) Core logic (@/lib/core), (6) Tipos (@/types). Separación entre grupos. Ordenar alfabéticamente dentro de cada grupo. | `pnpm lint` detecta imports desordenados |
| 02.2.7 | Configurar knip para detectar exports/deps sin usar | [AUTO/SCRIPT] | Crear `knip.config.ts`. Detectar: exports no utilizados, dependencias no referenciadas, archivos huérfanos. Ignorar: generated types (database.types.ts), test helpers, scripts/. Agregar script `pnpm knip` en package.json. | `pnpm knip` ejecuta; detecta dead code |
| 02.2.8 | Verificar pipeline de linting completo | [AUTO/SCRIPT] | Ejecutar: (1) `pnpm lint` sin errores, (2) `pnpm prettier --check src/` sin diferencias, (3) eslint-plugin-security activo, (4) import order enforced según Tech Spec §9, (5) `pnpm knip` sin falsos positivos. | 5/5 checks pasan |

---

# ══════════════════════════════════════════════════════════════════════════════

# SUBCAJA 02.3: GIT HOOKS (5 tareas)

# ══════════════════════════════════════════════════════════════════════════════

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.3.1 | Instalar y configurar Husky 9 | [AUTO/SCRIPT] | Ejecutar `pnpm exec husky init`. Verificar directorio `.husky/`. Script prepare en package.json. | `.husky/` existe; `git commit` dispara hooks |
| 02.3.2 | Configurar pre-commit con lint-staged | [AUTO/SCRIPT] | lint-staged: *.ts,*.tsx -> ESLint --fix + Prettier --write. *.css -> Prettier --write. Hook `.husky/pre-commit` ejecuta `pnpm lint-staged`. | Commit con error de formato se auto-corrige |
| 02.3.3 | Configurar pre-push hook | [AUTO/SCRIPT] | Hook ejecuta: `pnpm type-check && pnpm test --run`. Bloquea push si falla. | Push con error de tipos rechazado |
| 02.3.4 | Configurar commitlint con scopes alineados a Constantes Maestras v2.0.0 | [AUTO/SCRIPT] | Instalar @commitlint/cli + @commitlint/config-conventional. Tipos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. **Scopes alineados con 6 vectores + 12 niveles + 17 tareas + 9 herramientas + 7 servicios**: auth, avatar, tasks, vectors, economy, ui, db, api, **aura, jawline, wealth, physique, social, env, tools, inngest, payments, images, notifications, store, levels, health, redis, stripe, gemini, posthog, sentry, supabase**. Hook `.husky/commit-msg`. | `git commit -m "bad"` rechazado; `git commit -m "feat(jawline): add facial exercise tracker"` aceptado |
| 02.3.5 | Documentar branch naming convention | [CONFIG] | Crear `.github/BRANCH_NAMING.md`. Convención: `{type}/{caja}-{subcaja}/{description}`. Ejemplos: `feat/02.6/inngest-setup`, `fix/04.1/vector-clamp`, `chore/02.4/ci-lighthouse`. Types alineados con commitlint. Proteger ramas main y develop con branch protection rules. | Documento existe; formato claro |

---

# ══════════════════════════════════════════════════════════════════════════════

# SUBCAJA 02.4: CI/CD PIPELINE (14 tareas)

# ══════════════════════════════════════════════════════════════════════════════

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.4.1 | Configurar workflow CI principal | [AUTO/SCRIPT] | `.github/workflows/ci.yml`. Trigger: push main/develop + PRs. Jobs: lint, type-check, unit-test, build. Cache pnpm store + Next.js build cache. Node 20. Concurrency cancel-in-progress. Timeout 15min. Actions v4. (🔒 AUDIT FIX: cache + actions v4). | Push dispara workflow; 4 jobs ejecutan |
| 02.4.2 | Configurar Vitest para unit tests | [AUTO/SCRIPT] | `vitest.config.ts`: env jsdom, coverage v8 thresholds 80%, globals true. Sharding CI (matrix 2 workers). **NO retry** para tests flaky. Alias paths alineados con tsconfig. Incluir `/src/lib/core/` con **6 vectores** (rango 0.00-50.00, ENV 1-10), **17 tareas**, **9 herramientas**, **12 niveles** en scope. (🔒 AUDIT FIX: retry eliminado). | `pnpm test --run` ejecuta; coverage >= 80% |
| 02.4.3 | Configurar integration tests | [AUTO/SCRIPT] | Job separado en CI. Supabase local (`supabase start`), migraciones, seed con **6 personajes** (EL_RASTAS a EL_LIC, base_avatar_id 1-6) y **17 task categories** (4 AURA + 3 JAWLINE + 3 WEALTH + 3 PHYSIQUE + 4 SOCIAL). Tests en `tests/integration/`. Setup/teardown por suite. Verificar fn_complete_task_transaction y fn_process_judgement_night contra vectores clamped en rango 0-50 (ENV 1-10). Verificar daily BTC cap de **2,000** (Constantes Maestras §5.6). Verificar overall score: `AURA×0.20 + JAWLINE×0.15 + WEALTH×0.20 + PHYSIQUE×0.20 + SOCIAL×0.15 + (ENV×5)×0.10`. | Tests ejecutan contra Supabase local |
| 02.4.4 | Configurar E2E con Playwright | [AUTO/SCRIPT] | `playwright.config.ts`: Chromium + Firefox + WebKit. webServer arranca dev. Workflow `.github/workflows/e2e.yml` con cache de browsers y upload de artifacts on failure. Flows críticos: registro → onboarding (selección de **1 de 6 personajes**) → completar tarea → ver **6 vectores** en radar chart → verificar BTC earned con daily cap **2,000**. | `pnpm test:e2e` ejecuta; reporte HTML generado |
| 02.4.5 | Configurar security audit (4 herramientas + SLA) | [AUTO/SCRIPT] | `.github/workflows/security.yml`: (1) pnpm audit, (2) Snyk, (3) CodeQL, (4) Gitleaks. **SIN TRIVY** (no Docker). Política de triage: Critical = bloquea merge, SLA 24h. High = warning, SLA 7d. Medium/Low = backlog. Schedule cron diario + PRs. (🔒 AUDIT FIX: Trivy removido, SLA agregado). | 4 jobs ejecutan; críticas bloquean merge |
| 02.4.6 | Configurar preview deployments | [AUTO/SCRIPT] | `.github/workflows/preview.yml` o Vercel Git integration. Cada PR genera URL preview. Comentario automático en PR con URL + bundle size. Variables de preview apuntan a Supabase staging. | PR genera preview; comentario con URL |
| 02.4.7 | Configurar production deploy con smoke tests | [AUTO/SCRIPT] | `.github/workflows/production.yml`. Trigger: merge a main. Steps: build, deploy Vercel, smoke tests (health endpoint, homepage 200, API /api/health responds con status de **7 servicios**: Supabase, Stripe, Gemini, Upstash Redis, Inngest, Sentry, PostHog). **Rollback automático** si smoke tests fallan. (🔒 AUDIT FIX: smoke tests agregados). 🔄 ALINEACIÓN v2.0.0: 7 servicios (sin Resend). | Merge dispara deploy; smoke tests validan; fallo = rollback |
| 02.4.8 | Configurar bundle size check (200KB) | [AUTO/SCRIPT] | Workflow que compara bundle PR vs base. **Límite: 200KB initial** (alineado con spec). Comentario en PR con delta. Bloquea merge si excede. (🔒 AUDIT FIX: era 512KB, ahora 200KB). | PR excediendo 200KB bloqueado |
| 02.4.9 | Configurar Dependabot | [AUTO/SCRIPT] | `.github/dependabot.yml`: npm ecosystem, semanal, max 10 PRs. **Ignorar major bumps de Next.js y React** (actualización controlada per política de lockfile). (🔒 AUDIT FIX: lockfile policy). | Dependabot crea PRs semanales; majors Next/React ignorados |
| 02.4.10 | Configurar Lighthouse CI | [AUTO/SCRIPT] | `.github/workflows/lighthouse.yml`. Ejecutar Lighthouse en URLs críticas: /, /login, /dashboard, /tasks, /store. Thresholds: Performance >= 90, Accessibility >= 95, Best Practices >= 90, SEO >= 90. Budget aligned con 200KB. Upload artifacts. Comentario en PR con scores. | PR con performance < 90 genera warning |
| 02.4.11 | Configurar CODEOWNERS | [AUTO/SCRIPT] | `.github/CODEOWNERS`: `/src/lib/core/` → @core-team (motor puro de **6 vectores**, **17 tareas**, **12 niveles**, fórmulas de Constantes Maestras). `/supabase/migrations/` → @db-team (13 tablas, 12 ENUMs). `/src/app/api/webhooks/` → @backend-team (Stripe + Inngest). `/.github/workflows/` → @devops-team. | PRs que tocan core requieren review del owner |
| 02.4.12 | Configurar release workflow con tags semánticos | [AUTO/SCRIPT] | `.github/workflows/release.yml`. Trigger: push tag `v*`. Steps: build, test, deploy production, crear GitHub Release con changelog automático desde commits convencionales. Asociar release con caja correspondiente (ej: v0.2.0 = Caja 02 completada). | Tag v0.2.0 genera release con notas |
| 02.4.13 | Configurar accessibility check en CI | [AUTO/SCRIPT] | Integrar axe-core con Playwright. Verificar WCAG 2.1 AA en: formularios de login/registro, dashboard principal (visualización de **6 vectores** con colores Constantes Maestras §2.5), pantalla de tareas (**17 categorías** agrupadas por vector), tienda de items (4 rarezas con colores §2.7), perfil de personaje (**6 avatares**), sistema de niveles (**12 niveles** con colores §2.6). | 0 violaciones critical/serious en flujos principales |
| 02.4.14 | Verificar pipeline CI/CD completo | [AUTO/SCRIPT] | Script que valida: (1) CI workflow ejecuta 4 jobs, (2) E2E pasa, (3) Security scan sin críticas, (4) Preview deploys funcionales, (5) Production con smoke tests, (6) Bundle < 200KB, (7) Lighthouse >= 90, (8) Accessibility sin violaciones serias. | 8/8 checks pasan |

---
Continuando con la **PARTE 2** — Subcajas 02.5 y 02.6.

---

# ══════════════════════════════════════════════════════════════════════════════

# SUBCAJA 02.5: VARIABLES DE ENTORNO (7 tareas)

# ══════════════════════════════════════════════════════════════════════════════

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.5.1 | 🔄 Crear .env.example documentado con todos los servicios (alineado Constantes Maestras v2.0.0) | [AUTO/SCRIPT] | Todas las variables agrupadas por servicio: **Supabase (4)**: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PROJECT_ID. **Stripe (4)**: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID_MONTHLY. **Gemini (1)**: GEMINI_API_KEY (formato AIzaSy…). **Sentry (1)**: SENTRY_DSN. **PostHog (2)**: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST. **Upstash Redis (2)**: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (OVERRIDE: se mantiene a pesar de que Constantes Maestras §3 indica "❌ Sin Redis" — decisión del propietario del proyecto). **Inngest (2)**: INNGEST_EVENT_KEY, INNGEST_SIGNING_KEY. **App (1)**: NEXT_PUBLIC_APP_URL. Cada variable con comentario descriptivo y URL de obtención. **USAR GEMINI_API_KEY, NO REPLICATE_API_TOKEN** (§4.2 Prohibidas). **NO incluir RESEND_API_KEY** (§3: "Post-MVP: evaluar Resend", emails via Supabase Auth nativo). **Total: 17 variables.** | Archivo existe; contiene 17 variables; NO contiene REPLICATE ni RESEND |
| 02.5.2 | 🔄 Implementar validación Zod con @t3-oss/env-nextjs | [AUTO/SCRIPT] | `src/lib/env.ts`: schemas Zod **server**: SUPABASE_SERVICE_ROLE_KEY (min 1), STRIPE_SECRET_KEY (starts with 'sk_'), STRIPE_WEBHOOK_SECRET (starts with 'whsec_'), GEMINI_API_KEY (starts with 'AIza'), INNGEST_EVENT_KEY (min 1), INNGEST_SIGNING_KEY (min 1), UPSTASH_REDIS_REST_URL (url), UPSTASH_REDIS_REST_TOKEN (min 1), SENTRY_DSN (url). **client**: NEXT_PUBLIC_SUPABASE_URL (url), NEXT_PUBLIC_SUPABASE_ANON_KEY (min 1), NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (starts with 'pk_'), NEXT_PUBLIC_POSTHOG_KEY (min 1), NEXT_PUBLIC_POSTHOG_HOST (url), NEXT_PUBLIC_APP_URL (url). Exportar `env` (server) y `publicEnv` (client-safe). Fail-fast en startup si falta variable crítica. **CERO referencias a Replicate o Resend.** | App NO arranca si falta variable crítica; TS infiere tipos correctamente |
| 02.5.3 | Crear .env.local para desarrollo | [AUTO/SCRIPT] | Copiar de .env.example. Poblar con valores de desarrollo local. Verificar que .gitignore excluye .env*.local. Incluir Inngest dev key y Upstash dev credentials. | .env.local existe; NO está trackeado por git |
| 02.5.4 | Documentar política de versionado | [AUTO/SCRIPT] | En [ARCHITECTURE.md](http://ARCHITECTURE.md): majors de Next.js/React con tilde (~15.1.0). Actualizaciones major = decisión explícita. pnpm-lock.yaml SIEMPRE commiteado. Dependencias aprobadas: SOLO las listadas en Constantes Maestras v2.0.0 §4.1. Dependencias prohibidas: las de §4.2 (MongoDB, Firebase, tRPC, Prisma, Python, DALL-E, Replicate, [Fal.ai](http://Fal.ai)). (🔒 AUDIT FIX: lockfile policy). | Documentación existe; package.json usa tilde |
| 02.5.5 | Configurar variables en Vercel | [MANUAL] | Dashboard Vercel: configurar cada variable para Development, Preview, Production. Marcar SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, INNGEST_SIGNING_KEY, GEMINI_API_KEY, UPSTASH_REDIS_REST_TOKEN como encrypted. **17 variables total** en 3 environments. | Variables visibles en 3 environments |
| 02.5.6 | Configurar variables Inngest en Vercel | [MANUAL] | Dashboard Vercel: INNGEST_EVENT_KEY y INNGEST_SIGNING_KEY para Development (Inngest Dev Server), Preview (Inngest staging branch env), Production (Inngest production). Verificar que Inngest puede alcanzar cada environment via URL. | Inngest Dev Server conecta a preview y production |
| 02.5.7 | 🔄 Crear script de validación de env completo | [AUTO/SCRIPT] | `scripts/validate-env.ts`: importar `env` de `@/lib/env.ts` y verificar conectividad de los **7 servicios**: (1) Supabase health check (SELECT 1), (2) Stripe API key validation (list products), (3) Gemini API ping (generate text test), (4) Upstash Redis PING, (5) Inngest event send test, (6) Sentry DSN validation, (7) PostHog API key validation. Reportar status de cada servicio con indicador visual (✅/❌). Agregar como `pnpm env:check` en package.json. 🔄 ALINEACIÓN v2.0.0: 7 servicios (sin Resend). | `pnpm env:check` retorna 7/7 servicios OK |

---

# ══════════════════════════════════════════════════════════════════════════════

# SUBCAJA 02.6: SERVICIOS EXTERNOS (30 tareas)

# ══════════════════════════════════════════════════════════════════════════════

### 02.6.A — SUPABASE (9 tareas)

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.6.1 | Crear cuenta y proyecto Supabase | [MANUAL] | [app.supabase.com](http://app.supabase.com). Proyecto "metamen100-prod". Región: East US (LATAM). Guardar password de DB. Plan Pro recomendado para producción. | Proyecto activo en dashboard |
| 02.6.2 | Obtener credenciales API de Supabase | [MANUAL] | Settings > API: copiar Project URL, anon key, service_role key. Settings > Database: Connection String. Pegar 4 variables en .env.local (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PROJECT_ID). | 4 vars en .env.local; conexión funcional |
| 02.6.3 | Configurar Auth providers | [MANUAL] | Authentication > Providers: Email (confirm ON prod, OFF dev). Opcionalmente Google OAuth. Configurar redirect URLs para [localhost:3000](http://localhost:3000) (dev) y dominio producción. Rate limit de auth: 10/min por IP. **Supabase Auth es el sistema de emails nativo** (Constantes Maestras §3: "Emails: Supabase Auth nativo"). Configurar templates de email: (1) Confirmación de cuenta, (2) Magic link, (3) Cambio de email, (4) Reset de password. Templates en español (es-MX) con branding MetaMen100. | Email provider habilitado; registro test funciona; emails de auth se envían correctamente |
| 02.6.4 | Configurar Storage bucket para avatares | [MANUAL] | Storage: bucket "avatars", público, MIME: image/png, image/jpeg, image/webp. Max 5MB. Path por usuario: `{user_id}/{YYYY-MM-DD}.webp` (Constantes Maestras §5.10). Política: usuario solo puede leer sus propias imágenes + imágenes públicas del catálogo. **6 personajes** base como imágenes seed en `avatars/base/{1-6}.webp` correspondientes a: 1=EL_RASTAS, 2=EL_GUARRO, 3=EL_PECAS, 4=EL_GREÑAS, 5=EL_GUERO, 6=EL_LIC (Constantes Maestras §5.2). | Bucket visible en dashboard; 6 imágenes base subidas |
| 02.6.5 | Crear clientes Supabase (4 variantes) | [AUTO/SCRIPT] | `src/lib/supabase/`: **client.ts** (browser, createBrowserClient con Database types de **13 tablas**: profiles, avatar_states, wallets, subscriptions, daily_tasks, daily_logs, store_items, inventory, tool_progress, image_generation_queue, notifications, activity_logs, idempotency_keys — ADRs v2.0.0 §4.2). **server.ts** (server, createServerClient + cookies). **middleware.ts** (refresh sesión, validación de subscription status: trial/active/limbo/cancelled — Constantes Maestras §5.7). **admin.ts** (service_role para ops privilegiadas: fn_process_judgement_night, fn_process_avatar_death, image queue, fn_wallets_reset_daily). Usar @supabase/ssr. | 4 archivos; imports sin error TS; tipos de 13 tablas resuelven |
| 02.6.6 | Configurar Supabase CLI para desarrollo local | [AUTO/SCRIPT] | Instalar Supabase CLI: `pnpm add -D supabase`. Inicializar: `npx supabase init`. Configurar `supabase/config.toml` con auth, storage, realtime habilitados. Scripts: `pnpm db:start` (supabase start), `pnpm db:stop`, `pnpm db:status`. Migraciones locales: `supabase/migrations/`. Generar tipos: `pnpm db:types` → `src/types/database.types.ts` (13 tablas, **ENUMs PostgreSQL**: task_status, task_category con 17 valores, subscription_status, item_rarity, image_gen_status, notification_type, tool_type con 9 valores — ADRs v2.0.0 §4.1, **funciones PG**: fn_create_user_records, fn_complete_task_transaction, fn_process_judgement_night, fn_apply_vector_degradation, fn_process_avatar_death, fn_purchase_item_transaction, fn_spend_btc_safe, fn_calculate_btc_multiplier, fn_get_or_create_idempotency_key, fn_cleanup_expired_idempotency_keys, fn_wallets_reset_daily — ADRs §4.3). | `pnpm db:start` levanta Supabase local; `pnpm db:types` genera tipos |
| 02.6.7 | Configurar Supabase Realtime para notificaciones | [AUTO/SCRIPT] | `src/lib/supabase/realtime.ts`: suscripción a canal de notificaciones por usuario. Tablas monitoreadas: **notifications** (INSERT — tipos: task_completed, level_up, streak_milestone, health_warning, health_critical, avatar_died, image_ready, trial_expiring, payment_failed, general — ADRs §4.1), **avatar_states** (UPDATE de health_points 0-14, current_level 1-12, vectores 0-50, streak_days), **wallets** (UPDATE de btc_balance, today_earned vs daily_cap de **2,000** — Constantes Maestras §5.6). Reconexión automática. Filtro: `user_id=eq.{current_user}`. Para actualización en tiempo real de **6 vectores** en radar chart del dashboard. | Cambio en avatar_states llega a cliente en < 2s |
| 02.6.8 | 🔄 Configurar Supabase Auth email templates personalizados | [AUTO/SCRIPT] | En Supabase Dashboard > Authentication > Email Templates: personalizar los 4 templates nativos con branding MetaMen100 (colores Constantes Maestras §2: bg `#0A0A0A`, accent-gold `#D4AF37`, accent-cta `#FF073A`, text-primary `#FFFFFF`): (1) **Confirm signup**: "PROTOCOLO METAMEN100 — Confirma tu registro", incluir logo y CTA con accent-cta. (2) **Magic link**: "Tu acceso directo a MetaMen100". (3) **Change email**: "Confirma tu nuevo email". (4) **Reset password**: "Recupera tu acceso al protocolo". Todos en español (es-MX). From name: "MetaMen100". Subject lines con branding. 🔄 ALINEACIÓN v2.0.0: Reemplaza Resend (post-MVP) por Supabase Auth nativo. | 4 templates personalizados en dashboard; emails se envían con branding correcto |
| 02.6.9 | 🔄 Verificar flujo completo de Supabase Auth emails | [AUTO/SCRIPT] | Script `scripts/verify-auth-emails.ts` que valida: (1) Registro de nuevo usuario envía email de confirmación, (2) Reset password envía email con link válido (expira 1h, uso único — PRD US-AUTH-005), (3) Templates renderizan correctamente con colores de Constantes Maestras, (4) Rate limits de auth funcionan (Register 3/hora, Login 5/hora, Password Reset 3/hora — Constantes Maestras §5.11), (5) Redirect URLs configuradas para dev y production. Documentar que Resend será evaluado post-MVP per Constantes Maestras §3. | 5/5 verificaciones pasan; emails recibidos en inbox con branding correcto |

### 02.6.B — STRIPE (5 tareas)

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.6.10 | Crear cuenta Stripe y obtener API keys | [MANUAL] | [dashboard.stripe.com](http://dashboard.stripe.com). Developers > API Keys: Publishable Key + Secret Key a .env.local. | 2 vars en .env.local |
| 02.6.11 | 🔄 Crear productos y precios en Stripe alineados con Constantes Maestras v2.0.0 §1 | [MANUAL] | Crear productos según monetización oficial: (1) **"MetaMen100 Semanal"**: $2.99 USD/semana recurring. (2) **"MetaMen100 Mensual"**: $9.99 USD/mes recurring. (3) **"Protocolo 100"**: $29.99 USD one-time (100 días de acceso). Copiar Price IDs. Lookup keys: metamen_weekly, metamen_monthly, metamen_protocol100. Metadata: product_type=subscription/one-time. **❌ NO crear Plan Anual** (no existe per §1). **❌ NO crear Packs BTC Premium** (no existen). **❌ NO crear Early Bird** (no existe). 🔄 ALINEACIÓN v2.0.0: Los precios previos ($19.90/mes, $199/año) son INCORRECTOS. | 3 productos visibles en dashboard; Price IDs documentados; NO existe plan anual |
| 02.6.12 | Configurar webhooks en Stripe | [MANUAL] | Developers > Webhooks: endpoint `https://[dominio]/api/webhooks/stripe`. **4 eventos** (Constantes Maestras §1): checkout.session.completed, invoice.paid, invoice.payment_failed, customer.subscription.deleted. Copiar Signing Secret a .env.local como STRIPE_WEBHOOK_SECRET. | Endpoint en dashboard; signing secret en .env.local; 4 eventos suscritos |
| 02.6.13 | Configurar Customer Portal | [MANUAL] | Settings > Customer Portal: habilitar update payment, cancel subscription, view invoices. Business name "MetaMen100". Modo Limbo: 7 días post-cancelación (Constantes Maestras §1). | Portal accesible en preview |
| 02.6.14 | Crear clientes Stripe y webhook handler | [AUTO/SCRIPT] | `src/lib/stripe/client.ts` (browser, publishable key). `src/lib/stripe/server.ts` (secret key, Stripe SDK ^17.0.0). `src/app/api/webhooks/stripe/route.ts` con validación criptográfica de firma (constructEvent). Webhook handler para **4 eventos** de Constantes Maestras §1: (1) `checkout.session.completed` → status='active', registrar stripe_customer_id, stripe_subscription_id, current_period_end. (2) `invoice.paid` → renovar periodo, status='active'. (3) `invoice.payment_failed` → status='limbo', iniciar countdown **7 días** (Constantes Maestras §1: Modo Limbo). (4) `customer.subscription.deleted` → status='cancelled'. Idempotencia via event_id. Flujo de estados de suscripción: trial(5d) → active → limbo(7d) → cancelled (ADRs §7.2). Webhook handler interactúa con tabla subscriptions → afecta acceso a dashboard, generación de imágenes de **6 personajes**, y procesamiento de tareas. | Archivos existen; TS compila; firma se valida; 4 eventos manejados |

### 02.6.C — GEMINI AI (2 tareas)

| ID | Título | Tipo | Detalle | Validación |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| 02.6.15 | Obtener API key de Gemini | [MANUAL] | [aistudio.google.com](http://aistudio.google.com) o Google Cloud Console. API key para Gemini 2.5 Flash (único proveedor IA — Constantes Maestras §3: "Único proveedor. Sin fallback externo."). Pegar como GEMINI_API_KEY en .env.local. **NO usar Replicate** (§4.2 Prohibida). **NO usar DALL-E** (§4.2: "Más lento y más caro que Gemini"). **NO usar [Fal.ai](http://Fal.ai)** (§4.2: "Requiere webhook propio + complejidad extra"). | GEMINI_API_KEY en .env.local (formato AIzaSy…) |  |  |
| 02.6.16 | Crear cliente Gemini con soporte para 6 personajes y 6 vectores | [AUTO/SCRIPT] | `src/lib/ai/gemini.ts`: GoogleGenerativeAI client (@google/generative-ai ^0.21.0). Modelo: **gemini-2.5-flash** (Constantes Maestras §3). Función `generateAvatarImage(params)` que recibe: **base_avatar_id** (1-6) mapeado a tokens de personaje (ADRs §5.2): 1=EL_RASTAS ("brown dreadlocks, thick locks, round face, friendly eyes, warm brown skin"), 2=EL_GUARRO ("bald, shaved head, square jaw, small eyes, thick neck, tan skin"), 3=EL_PECAS ("curly red-brown hair, messy, freckles, thin face, sharp features, pale skin with freckles"), 4=EL_GREÑAS ("balding with long hair in back, goatee, angular face, deep set eyes, weathered skin"), 5=EL_GUERO ("blonde wavy hair, styled back, strong jaw, blue eyes, handsome, fair skin"), 6=EL_LIC ("black hair, receding hairline, rectangular glasses, stubble, tired eyes, olive skin"). **vectorsSnapshot** (6 vectores con valores que afectan el prompt: AURA 0-50 → luminosidad/aura, JAWLINE 0-50 → definición facial, WEALTH 0-50 → vestimenta/accesorios, PHYSIQUE 0-50 → complexión corporal, SOCIAL 0-50 → expresión/confianza, ENV 1-10 → entorno/fondo mapeado a 10 tokens de ADRs §5.3). **equippedItems** (tokens de items del inventario). Retry con exponential backoff (3 intentos: 1s, 5s, 30s — ADRs §5.4). Si falla: mantener imagen anterior + badge "SIN ACTUALIZAR". Storage path: `/avatars/{user_id}/{YYYY-MM-DD}.webp` (Constantes Maestras §5.10). **CERO referencias a Replicate, DALL-E, o [Fal.ai](http://Fal.ai) en codebase.** | Archivo existe; TS compila; `grep -rn "replicate\ | dall-e\ | [fal.ai](http://fal.ai)" src/` = 0 resultados |

### 02.6.D — UPSTASH REDIS Y RATE LIMITING (4 tareas)

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.6.17 | Crear cuenta y database Upstash | [MANUAL] | [console.upstash.com](http://console.upstash.com). Redis database. Región cercana a Vercel (East US). Copiar REST URL + REST Token a .env.local. Plan: Free tier suficiente para inicio. **NOTA IMPORTANTE**: Constantes Maestras v2.0.0 §3 indica "❌ Sin Redis" y ADRs §2.5 listan "Redis standalone" como tecnología prohibida. Sin embargo, por **decisión explícita del propietario del proyecto**, Upstash Redis SE MANTIENE para rate limiting serverless. Upstash Redis NO es "Redis standalone" — es un servicio HTTP-based serverless compatible con el paradigma de Vercel. | 2 vars en .env.local; UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN |
| 02.6.18 | Crear cliente Redis y rate limiters | [AUTO/SCRIPT] | `src/lib/redis/client.ts`: @upstash/redis + @upstash/ratelimit. Limiters basados en Constantes Maestras §5.11: **auth** (Login 5/hora, Register 3/hora, Verify Phone 3/hora, Password Reset 3/hora), **task_completion** (Complete Task 50/hora per user_id), **read_tasks** (Read Tasks 100/min per user_id), **store_purchase** (Store Purchase 10/min per user_id), **store_browse** (Store Browse 100/min per user_id), **image_generation** (5/hour per user — protección adicional). **USAR UPSTASH REDIS, NO Map() EN MEMORIA** (🔒 AUDIT FIX CRÍTICO: rate limiting in-memory no funciona en serverless Vercel). | Todos los limiters usan Ratelimit de @upstash; grep "new Map" en middleware = 0 |
| 02.6.19 | Implementar rate limiting en middleware | [AUTO/SCRIPT] | `src/middleware.ts`: rate limiting via Upstash Redis. Seleccionar limiter según pathname y alineado con tabla de Constantes Maestras §5.11: `/api/auth/login` = auth (5/hora, key: IP+email), `/api/auth/register` = auth (3/hora, key: IP), `/api/auth/verify-phone` = auth (3/hora, key: IP+phone), `/api/auth/reset-password` = auth (3/hora, key: IP+email), `/api/tasks/complete` = task_completion (50/hora, key: user_id), `/api/tasks` GET = read_tasks (100/min, key: user_id), `/api/store/purchase` = store_purchase (10/min, key: user_id), `/api/store` GET = store_browse (100/min, key: user_id). Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After. 429 si excede con mensaje: "Demasiados intentos. Intenta en X minutos." (PRD US-AUTH-001). Fail-open si Redis falla (graceful degradation). **NO USAR Map() EN MEMORIA.** | Requests rápidos: headers decrementan; exceder límite retorna 429 con Retry-After |
| 02.6.20 | Verificar rate limiting en serverless | [AUTO/SCRIPT] | Test que valida: (1) límites persisten entre invocaciones serverless (no se resetean con cold start), (2) IPs diferentes = contadores independientes, (3) headers correctos en respuesta 429, (4) task_completion limita a 50/hora por user_id (Constantes Maestras §5.11), (5) store_purchase limita a 10/min por user_id, (6) fail-open funciona si Upstash no responde. Documentar explícitamente que se usa Upstash Redis por decisión del propietario a pesar de que §3 indica "Sin Redis". | Test pasa 6/6; documentación explícita del override |

### 02.6.E — INNGEST (4 tareas)

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.6.21 | Crear cuenta Inngest | [MANUAL] | [app.inngest.com](http://app.inngest.com). Crear app "metamen100". Obtener Event Key + Signing Key. Pegar en .env.local como INNGEST_EVENT_KEY e INNGEST_SIGNING_KEY. Inngest es el sistema primario de colas/jobs (Constantes Maestras §3: "Inngest (primario) + BullMQ (backup)"). | 2 vars en .env.local; app visible en dashboard |
| 02.6.22 | 🔄 Configurar cliente Inngest y event types | [AUTO/SCRIPT] | `src/lib/inngest/client.ts`: crear Inngest client con id "metamen100". `src/lib/inngest/events.ts`: definir event types con Zod. Eventos: (1) `judgement-night/process` (userId, timezone, dayNumber — trigger para Tech Spec §3.2). (2) `image/generate.requested` (userId, dayNumber, vectorsSnapshot con **6 vectores** en rangos correctos: AURA/JAWLINE/WEALTH/PHYSIQUE/SOCIAL 0.00-50.00, ENV 1-10, base_avatar_id 1-6 mapeado a **6 personajes** de Constantes Maestras §5.2, equippedItems). (3) `cleanup/daily` (batch: wallets reset today_earned=0, idempotency cleanup, notifications cleanup). (4) `degradation/apply` (userId o batch, para fn_apply_vector_degradation — cuando usuario no completa tareas, vectores bajan con values DOWN de Constantes Maestras §5.5). 🔄 ALINEACIÓN v2.0.0: Removido evento `email/send` que usaba Resend (post-MVP). Emails transaccionales usan Supabase Auth nativo. | Client exporta; eventos tipados; Zod valida payloads; NO existe evento email/send |
| 02.6.23 | 🔄 Configurar Inngest API route con 5 funciones | [AUTO/SCRIPT] | `src/app/api/inngest/route.ts`: serve() con **5 funciones** registradas (🔄 reducido de 6, removida send-transactional-email): (1) **`judgement-night-cron`**: cron cada hora, procesa usuarios cuya timezone marca 23:59 (PRD US-SYS-001), batch de 50, pg_try_advisory_xact_lock(user_id), calcula rate (completed/total), si ≥80% → streak++, HP+1 (max **10 base / 14 expandido** — Constantes Maestras §5.4), si <80% → streak=0, HP-1, si HP=0 → fn_process_avatar_death (penalización: 1ª muerte 30% BTC / 2ª 40% / 3ª+ 50% + hibernación — §5.6), encolar imagen IA, INSERT daily_logs con snapshot de **6 vectores**. (2) **`process-image-queue`**: triggered por evento image/generate.requested, poll con FOR UPDATE SKIP LOCKED, llamar Gemini 2.5 Flash con prompt de **6 personajes × 6 vectores × 10 ENV tokens** (ADRs §5.2-5.3), guardar en Storage `/avatars/{user_id}/{YYYY-MM-DD}.webp`, max 3 reintentos con exponential backoff 1s/5s/30s (ADRs §5.4). (3) **`cleanup-cron`**: cada 6h, llama fn_cleanup_expired_idempotency_keys + cleanup old notifications. (4) **`daily-wallet-reset`**: diario 00:05 UTC, llama fn_wallets_reset_daily (resetea today_earned a 0, daily_cap permanece en **2,000** — Constantes Maestras §5.6). (5) **`apply-vector-degradation`**: diario, aplica degradación de vectores para usuarios que no completaron tareas (valores DOWN simétricos de §5.5, ej: meditation -0.50, cold_shower -1.78). | `GET /api/inngest` retorna 5 funciones registradas; NO existe send-transactional-email |
| 02.6.24 | Configurar Inngest Dev Server para desarrollo local | [AUTO/SCRIPT] | Script `pnpm inngest:dev` que ejecuta `npx inngest-cli@latest dev`. Verificar que Dev Server se conecta a la app local en [localhost:3000/api/inngest](http://localhost:3000/api/inngest). Probar envío manual de evento `judgement-night/process` desde UI del Dev Server con payload de prueba: userId válido, timezone "America/Mexico_City", dayNumber=1. Verificar que la función ejecuta correctamente contra Supabase local con **6 vectores** en estado inicial (todos 0, ENV=1), **HP=5** (Constantes Maestras §5.4: HP Inicial). Documentar workflow de testing local. | Dev Server muestra 5 funciones registradas; evento manual ejecuta función correctamente |

### 02.6.F — OBSERVABILIDAD (4 tareas)

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.6.25 | Crear proyecto Sentry | [MANUAL] | [sentry.io](http://sentry.io). Proyecto Next.js. Copiar DSN a .env.local como SENTRY_DSN. | SENTRY_DSN en .env.local |
| 02.6.26 | Configurar Sentry completo | [AUTO/SCRIPT] | `npx @sentry/wizard@latest -i nextjs`. tracesSampleRate: **0.3** (🔒 AUDIT FIX: no 0.1). beforeSend filtra errores operacionales (rate limit 429, auth redirect). Tags custom: `vector_count: 6`, `task_categories: 17`, `tool_types: 9`, `levels: 12`, `avatar_base_id`. Breadcrumbs para mecánicas de juego: task completion (17 categorías), judgement night (rate ≥80% / <80%), death (penalización escalonada 30%/40%/50%), level up (12 niveles INDIGENTE→SEMI-DIOS), purchase (4 rarezas), vector change (6 vectores con rango 0-50), streak milestone, HP change (0-14). | Error intencional visible en Sentry dashboard con tags custom |
| 02.6.27 | Crear proyecto PostHog | [MANUAL] | [app.posthog.com](http://app.posthog.com). Copiar API key + host URL. autocapture: false (privacy first). | 2 vars en .env.local (NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST) |
| 02.6.28 | 🔄 Configurar PostHog client y provider | [AUTO/SCRIPT] | `src/lib/analytics/posthog.ts`: client-side con posthog-js, server-side con posthog-node. `src/components/providers/PostHogProvider.tsx`: React context provider, inicializar en layout.tsx. Eventos personalizados a trackear: `task_completed` (category de **17** — Constantes Maestras §5.5, vector afectado de **6**, btc_earned con cap de **2,000**/día), `day_judged` (status exitoso/fallido, **6 vectores** snapshot, streak_days, day_number de 1-100+), `avatar_died` (death_count, btc_lost con penalización escalonada §5.6, vectores reseteados: jawline=0, wealth=0, physique=0, social=0, env=1, aura preservada 30%), `level_up` (from, to — **12 niveles** de §5.3: INDIGENTE, REFUGIADO, MANTENIDO, ALUCÍN, PEÓN, HOMBRE COMÚN, INFLUYENTE, PUDIENTE, MILLONARIO, MAGNATE, ÉLITE, SEMI-DIOS), `item_purchased` (item_id, category, rarity de **4**: common/rare/epic/legendary — §5.7, price_btc), `avatar_selected` (base_avatar_id 1-6, character_key: EL_RASTAS/EL_GUARRO/EL_PECAS/EL_GREÑAS/EL_GUERO/EL_LIC). **Feature flags**: `enable_postgame_levels` (para rollout gradual de niveles 11 ÉLITE y 12 SEMI-DIOS que son post-game — Constantes Maestras §5.3). 🔄 ALINEACIÓN v2.0.0: Cambiado feature flag de `enable_social_vector` (SOCIAL ya es vector estándar) a `enable_postgame_levels`. | Provider funcional; eventos llegan a PostHog dashboard; feature flag configurable |

### 02.6.G — SUPABASE AUTH EMAIL AVANZADO (2 tareas)

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.6.29 | 🔄 Configurar Supabase Auth hooks para notificaciones por email de mecánicas de juego | [CONFIG] | Documentar plan de implementación post-MVP para emails transaccionales de mecánicas de juego: (1) trial-expiring (trial vence en 24h — Constantes Maestras §1: Trial 5 días), (2) payment-failed (pago fallido, modo limbo activado — §1: Modo Limbo 7 días), (3) streak-milestone (felicitación por streak de 7/14/30/50/100 días), (4) avatar-died (notificación de muerte, datos de pérdida: BTC % escalonado §5.6, vectores reseteados), (5) welcome (bienvenida post-registro). **Para MVP**: estos emails NO se envían (Constantes Maestras §3: "Post-MVP: evaluar Resend"). Documentar que en v1.1 se evaluará Resend per §3. **Para MVP actual**: solo se envían emails nativos de Supabase Auth (confirmación, magic link, reset password, cambio email — configurados en 02.6.8). Crear archivo `docs/EMAIL_ROADMAP.md` con plan de implementación post-MVP. | Documento EMAIL_[ROADMAP.md](http://ROADMAP.md) existe; NO hay código de envío de emails transaccionales de juego en MVP; emails de auth funcionan via Supabase nativo |

### 02.6.H — VERIFICACIÓN FINAL (1 tarea)

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.6.30 | 🔄 Verificar integración end-to-end de todos los servicios | [AUTO/SCRIPT] | Script `scripts/verify-services.ts` que valida conectividad y configuración de los **7 servicios**: (1) Supabase: query profiles table + verificar auth email templates configurados, (2) Stripe: list products (debe retornar 3: Semanal $2.99, Mensual $9.99, Protocolo $29.99 — Constantes Maestras §1), (3) Gemini: generate text con prompt de prueba de personaje EL_RASTAS, (4) Upstash: PING + verificar rate limiter funcional, (5) Inngest: send test event + verificar 5 funciones registradas, (6) Sentry: capture test error + verificar tags custom, (7) PostHog: capture test event + verificar feature flag `enable_postgame_levels`. Reporte con status por servicio (✅/❌). Agregar como `pnpm services:verify`. 🔄 ALINEACIÓN v2.0.0: 7 servicios (sin Resend), precios correctos de Stripe, 5 funciones Inngest (sin send-email). | `pnpm services:verify` retorna 7/7 OK |

---
Continuando con la **PARTE 3 (FINAL)** — Subcajas 02.7, 02.8 + Resumen de Fixes + Mejoras + Resumen Ejecutivo.

---

# ══════════════════════════════════════════════════════════════════════════════

# SUBCAJA 02.7: HERRAMIENTAS DE DESARROLLO (10 tareas)

# ══════════════════════════════════════════════════════════════════════════════

| ID | Título | Tipo | Detalle | Validación |
| --- | --- | --- | --- | --- |
| 02.7.1 | Crear scripts de utilidad | [AUTO/SCRIPT] | `scripts/`: [verify-setup.sh](http://verify-setup.sh) (deps + 7 servicios), [clean.sh](http://clean.sh) (.next + node_modules + .inngest), [security-check.sh](http://security-check.sh) (audit + .env check + gitleaks local). Agregar a package.json como `pnpm verify`, `pnpm clean`, `pnpm security`. | 3 scripts ejecutan sin error |
| 02.7.2 | Configurar VSCode settings | [AUTO/SCRIPT] | `.vscode/settings.json`: formatOnSave, defaultFormatter Prettier, eslint.validate TS/TSX, codeActionsOnSave ESLint fix, TypeScript SDK path, excluir node_modules/.next/.inngest de búsqueda. Tailwind intellisense con **todas** las custom classes del design system de Constantes Maestras v2.0.0: vectores (vector-aura `#9B59B6`, vector-jawline `#E74C3C`, vector-wealth `#27AE60`, vector-physique `#E67E22`, vector-social `#3498DB`, vector-env `#1ABC9C`), elevación (bg-base `#0A0A0A`, bg-card `#1A1A1A`, bg-elevated `#2D2D2D`), accent dual (accent-gold `#D4AF37`, accent-cta `#FF073A`, accent-active `#00E5FF`), semánticos (error `#FF0000`, success `#00FF88`, warning `#FFB800`, info `#00E5FF`), niveles (level-low `#95A5A6`, level-mid `#8D6E63`, level-high `#3498DB`, level-elite `#D4AF37`, level-god `#9B59B6`), rarezas (rarity-common `#95A5A6`, rarity-rare `#3498DB`, rarity-epic `#9B59B6`, rarity-legendary `#D4AF37`), personajes (avatar-rastas, avatar-guarro, avatar-pecas, avatar-greñas, avatar-guero, avatar-lic). | Abrir en VSCode aplica config; intellisense autocompleta clases custom |
| 02.7.3 | Configurar VSCode extensions | [AUTO/SCRIPT] | `.vscode/extensions.json`: ESLint, Prettier, Tailwind CSS IntelliSense, GitLens, Error Lens, PostCSS Language Support, Inngest Extension (si disponible). | VSCode muestra prompt de extensiones |
| 02.7.4 | Configurar VSCode debug/launch | [AUTO/SCRIPT] | `.vscode/launch.json`: Debug Next.js Server, Debug Client, Debug Vitest (con configuración para tests de **6 vectores** en `/src/lib/core/vectors/` con rangos 0-50 y pesos de Constantes Maestras §5.1), Debug Playwright, Debug Inngest Function. Sourcemaps TS. | F5 lanza debugger; breakpoints funcionan en core/ |
| 02.7.5 | 🔄 Crear script seed de base de datos alineado con Constantes Maestras v2.0.0 | [AUTO/SCRIPT] | `scripts/seed.ts`: Supabase admin client. Crear datos de prueba alineados con todas las constantes oficiales: (1) **Usuario de prueba** con base_avatar_id=1 (EL_RASTAS — Constantes §5.2: "El Gamer Olvidado", tokens: "brown dreadlocks, thick locks, round face, friendly eyes, warm brown skin"). (2) **avatar_states** con **6 vectores** nivel medio (aura_lvl=25.00, jawline_lvl=20.00, wealth_lvl=15.00, physique_lvl=22.00, social_lvl=18.00, env_lvl=5 — rangos §5.1: 0.00-50.00, ENV 1-10), health_points=7 (de máximo base 10, expandido **14** — §5.4), current_level=5 (PEÓN — §5.3: min_day 15, min_score 20.0), streak_days=14 (streak_bonus ×1.5 — §5.6). (3) **wallet** con btc_balance=5000, total_earned=12000, total_spent=7000, today_earned=800, daily_cap=**2,000** (§5.6 — 🔄 CORREGIDO de 3,500). (4) **17 daily_tasks** (una por categoría §5.5): AURA → meditation(+0.50, 50BTC, 7/sem), thanks(+0.50, 40BTC, 7/sem), posture(+1.16, 60BTC, 3/sem), wake_early(+0.50, 50BTC, 7/sem); JAWLINE → facial(+1.16, 80BTC, 3/sem), voice(+1.16, 70BTC, 3/sem), cold_shower(+1.78, 100BTC, 2/sem); WEALTH → skill_learning(+0.70, 80BTC, 5/sem), focus_work(+0.70, 80BTC, 5/sem), reading(+0.58, 60BTC, 6/sem); PHYSIQUE → strength(+0.70, 100BTC, 5/sem), cardio(+1.16, 90BTC, 3/sem), hydration(+0.50, 40BTC, 7/sem); SOCIAL → talk_friend(+1.78, 70BTC, 2/sem), family(+1.78, 70BTC, 2/sem), kegel(+0.70, 60BTC, 5/sem), journal(+0.58, 50BTC, 6/sem). (5) **10+ store_items** con 4 rarezas (common `#95A5A6`, rare `#3498DB`, epic `#9B59B6`, legendary `#D4AF37` — §2.7): armaduras, accesorios, propiedades ENV. (6) **3 inventory items** (1 equipped). (7) **tool_progress** para **9 herramientas** (§5.9): meditation→AURA, focus_timer→WEALTH(focus_work), lookmaxing→JAWLINE(facial), journal→SOCIAL, logbook→WEALTH(reading), kegel→SOCIAL, posture→AURA, metagym→PHYSIQUE(strength+cardio), voice→JAWLINE. (8) **5 daily_logs** con vectors_snapshot de **6 vectores** y day_status (éxito ≥80%, fallo <80% — §5.4). (9) **subscription** status='active', plan='monthly' ($9.99 — §1). Idempotente (check before insert). `pnpm db:seed`. | `pnpm db:seed` sin error; datos verificables en Supabase Studio; daily_cap = 2000 |
| 02.7.6 | Crear script reset de desarrollo | [AUTO/SCRIPT] | `scripts/reset.ts`: truncar tablas en orden de dependencia (inventory → daily_tasks → daily_logs → avatar_states → wallets → subscriptions → tool_progress → activity_logs → notifications → image_generation_queue → idempotency_keys → profiles → store_items — 13 tablas de ADRs §4.2), re-seed. `pnpm db:reset`. Confirmación interactiva para proteger contra ejecución accidental. | `pnpm db:reset` limpia y re-siembra |
| 02.7.7 | 🔄 Configurar system prompt para AI agents alineado con Constantes Maestras v2.0.0 | [AUTO/SCRIPT] | [AGENTS.md](http://AGENTS.md) o .claude/settings.json: stack inmutable (Next.js 15, pnpm, Supabase/PostgreSQL, Inngest, Gemini 2.5 Flash, Upstash Redis, Vercel, TypeScript pure core). **Contexto de juego actualizado con valores de Constantes Maestras v2.0.0**: 6 vectores (AURA 0.20 `#9B59B6`, JAWLINE 0.15 `#E74C3C`, WEALTH 0.20 `#27AE60`, PHYSIQUE 0.20 `#E67E22`, SOCIAL 0.15 `#3498DB`, ENV 0.10 `#1ABC9C` — rango 0-50, ENV 1-10), 6 personajes (EL_RASTAS "El Gamer Olvidado", EL_GUARRO "El Cadenero Caído", EL_PECAS "El Genio Quebrado", EL_GREÑAS "El Rockero Olvidado", EL_GUERO "El Galán Pasado", EL_LIC "El Ejecutivo Reemplazado" — §5.2), 17 task categories (4 AURA + 3 JAWLINE + 3 WEALTH + 3 PHYSIQUE + 4 SOCIAL — §5.5 con valores UP/DOWN/BTC exactos), 9 tool_types (§5.9), 13 DB tables, **12 niveles** (INDIGENTE → SEMI-DIOS, 10 protocolo + 2 post-game — §5.3), BTC daily cap **2,000** (🔄 CORREGIDO de 3,500), death penalty escalado 30%→40%→50% con AURA preservada 30% (§5.6), streak multiplier {0:×1.0, 1-7:×1.1, 8-14:×1.5, 15+:×2.5} (§5.6), diminishing returns max(0.25, 0.90^(rep-1)) (§5.6), health **5 inicial, 10 max base, 14 max expandido** (🔄 CORREGIDO de 13), HP recovery: día ≥80% = +1 HP, día <80% = -1 HP (§5.4). Overall score: `AURA×0.20 + JAWLINE×0.15 + WEALTH×0.20 + PHYSIQUE×0.20 + SOCIAL×0.15 + (ENV×5)×0.10`. Monetización: Trial 5d $0, Semanal $2.99, Mensual $9.99, Protocolo $29.99 (§1). Emails: Supabase Auth nativo (Resend post-MVP). Prohibidas: MongoDB, Firebase, tRPC, Prisma, DALL-E, Replicate, [Fal.ai](http://Fal.ai), Python (§4.2). Skills requeridos: TS strict, Zod validation, Result<T,E> monad, branded types, pure functions. | Archivo existe; AI agents generan código alineado con Constantes Maestras v2.0.0 |
| 02.7.8 | 🔄 Crear health check endpoint | [AUTO/SCRIPT] | `src/app/api/health/route.ts`: GET handler público (sin auth). Verificar **4 servicios runtime** (los que la app necesita en cada request): (1) Supabase connection (SELECT 1), (2) Upstash Redis PING, (3) Inngest status, (4) App version desde package.json. Retornar JSON: `{ status: "healthy"/"degraded"/"unhealthy", services: { supabase: "ok"/"error", redis: "ok"/"error", inngest: "ok"/"error" }, version: "x.y.z", uptime: seconds, timestamp: ISO }`. Para smoke tests de CI/CD (02.4.7). Servicios como Stripe, Gemini, Sentry, PostHog se verifican en el script `pnpm services:verify` (02.6.30) pero no en el health check runtime. | `GET /api/health` retorna 200 con status de 4 servicios |
| 02.7.9 | Crear script de smoke test local | [AUTO/SCRIPT] | `scripts/smoke-test.ts`: (1) Verificar /api/health retorna 200 con servicios OK, (2) Verificar / retorna 200, (3) Verificar /login renderiza, (4) Verificar Supabase auth funcional (crear y borrar usuario test), (5) Verificar rate limiting responde con headers X-RateLimit-*. Agregar como `pnpm test:smoke`. | `pnpm test:smoke` pasa 5/5 en dev local |
| 02.7.10 | Configurar Docker Compose para Supabase local | [AUTO/SCRIPT] | `docker-compose.supabase.yml` (opcional, alternativa a `supabase start`): PostgreSQL 15 + GoTrue + PostgREST + Storage + Realtime. Volúmenes persistentes para data. Scripts de migración montados. Seed con datos de **6 personajes**, **17 categorías**, **9 herramientas**, daily_cap **2,000** (Constantes Maestras §5.6). Útil para desarrollo offline o CI sin Supabase CLI. `pnpm db:docker:up` y `pnpm db:docker:down`. | `docker compose up` levanta Supabase local; migraciones ejecutan |

---

# ══════════════════════════════════════════════════════════════════════════════

# SUBCAJA 02.8: ESTRUCTURA Y DOCUMENTACIÓN (10 tareas)

# ══════════════════════════════════════════════════════════════════════════════

| ID | Título | Tipo | Detalle | Validación |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 02.8.1 | 🔄 Crear estructura completa de carpetas alineada con Tech Spec v2.0.0 §4 | [CONFIG] | Todas las carpetas alineadas con la estructura de carpetas oficial del Tech Spec y las constantes de §5. **App routes**: `src/app/(auth)/login/`, `register/`, `callback/`; `(dashboard)/dashboard/`, `avatar/`, `tasks/`, `tools/` (9 herramientas: meditation, focus, gym, journal, library, facial, voice, cold, kegel), `shop/`, `inventory/`, `settings/`; `api/webhooks/stripe/`, `api/inngest/`, `api/health/`, `api/cron/judgement/`. **Actions** (Tech Spec §1.2): `src/lib/server/actions/auth/`, `tasks/`, `store/`, `profile/`, `wallet/`, `tools/`, `avatar/`, `journal/`. **Core** (motor puro — cero I/O): `src/lib/core/vectors/` (types.ts, constants.ts, calculations.ts — 6 vectores), `levels/` (12 niveles), `health/` (HP 5-14), `judgement/`, `economy/` (BTC cap 2,000, diminishing, streak, death), `state-machines/`, `validation/`, `types/` (result.ts, branded.ts), `utils/`. **Lib**: `src/lib/supabase/` (client, server, middleware, admin), `stripe/`, `ai/` (gemini.ts — NO replicate), `redis/` (client.ts con @upstash), `inngest/` (client, events — 5 funciones), `analytics/` (posthog.ts). **Components**: `src/components/ui/` (shadcn), `vectors/` (6 vector displays con colores §2.5), `avatar/` (6 character renderers), `tasks/` (17 category cards), `tools/` (9 tool interfaces), `store/` (4 rarezas con colores §2.7), `health/` (HP visual 0-14), `economy/` (BTC, streak, multipliers), `charts/` (radar chart 6 ejes), `providers/` (PostHogProvider). **Otros**: `src/hooks/`, `types/`, `stores/` (auth-store, avatar-store, wallet-store — Zustand 5), `workers/` (image-generation.ts). **Infra**: `supabase/migrations/`, `supabase/seed.sql`, `tests/{unit,integration,e2e}/`, `scripts/`, `docs/`. .gitkeep en vacías. **NO crear**: `src/lib/email/` (Resend es post-MVP). | `find src -type d` muestra todas las carpetas; NO existe lib/email/ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 02.8.2 | 🔄 Crear archivos base de tipos alineados con Constantes Maestras v2.0.0 | [CONFIG] | `src/types/`: **vectors.ts** — VectorName = 'AURA' \ | 'JAWLINE' \ | 'WEALTH' \ | 'PHYSIQUE' \ | 'SOCIAL' \ | 'ENV' (§5.1); VectorState = { aura_lvl: number, jawline_lvl: number, wealth_lvl: number, physique_lvl: number, social_lvl: number, env_lvl: number }; VECTOR_WEIGHTS = { AURA: 0.20, JAWLINE: 0.15, WEALTH: 0.20, PHYSIQUE: 0.20, SOCIAL: 0.15, ENV: 0.10 }; VECTOR_COLORS = { AURA: { primary: '#9B59B6', secondary: '#E8D5F2' }, JAWLINE: { primary: '#E74C3C', secondary: '#FADBD8' }, WEALTH: { primary: '#27AE60', secondary: '#D5F5E3' }, PHYSIQUE: { primary: '#E67E22', secondary: '#FDEBD0' }, SOCIAL: { primary: '#3498DB', secondary: '#D6EAF8' }, ENV: { primary: '#1ABC9C', secondary: '#D1F2EB' } }; rango 0.00-50.00 (ENV 1-10). **avatar.ts** — AvatarCharacterId = 1\ | 2\ | 3\ | 4\ | 5\ | 6; AvatarCharacterKey = 'EL_RASTAS'\ | 'EL_GUARRO'\ | 'EL_PECAS'\ | 'EL_GREÑAS'\ | 'EL_GUERO'\ | 'EL_LIC' (§5.2); CHARACTER_MAP con id, key, título, transformación, tokens IA. **tasks.ts** — TaskCategory = 17 valores (§5.5); TaskArchetype = 'MENTAL'\ | 'FACIAL'\ | 'ECONOMIC'\ | 'PHYSICAL'\ | 'SOCIAL'; TASK_CONFIG map con UP, DOWN (simétrico), rep_per_week, btc_base, max_rep_x100, vector asociado. **tools.ts** — ToolType = 'meditation'\ | 'focus_timer'\ | 'lookmaxing'\ | 'journal'\ | 'logbook'\ | 'kegel'\ | 'posture'\ | 'metagym'\ | 'voice' (§5.9); TOOL_MAP con herramienta, vector, tareas asociadas. **economy.ts** — DAILY_BTC_CAP = **2,000** (🔄 CORREGIDO §5.6); DIMINISHING_FORMULA description; STREAK_MULTIPLIER_TABLE = { 0: 1.0, '1-7': 1.1, '8-14': 1.5, '15+': 2.5 }; DEATH_PENALTY_TABLE = { 1: { btc_loss: 0.30, aura_preserved: 0.30 }, 2: { btc_loss: 0.40, aura_preserved: 0.30 }, '3+': { btc_loss: 0.50, aura_preserved: 0.30, hibernation: true } }. **levels.ts** — LevelNumber = 1-12; LEVELS_CONFIG array con 12 entradas (§5.3): nombre, min_day, min_score, btc_bonus, health_bonus, fase; LEVEL_COLORS = { '1-3': '#95A5A6', '4-6': '#8D6E63', '7-9': '#3498DB', '10-11': '#D4AF37', '12': '#9B59B6' }. **health.ts** — HP_INITIAL = 5; HP_MAX_BASE = 10; HP_MAX_EXPANDED = **14** (🔄 CORREGIDO §5.4); HP_BONUS_LEVELS = [3, 6, 9, 12]; SUCCESS_THRESHOLD = 0.80. **store.ts** — ItemRarity = 'common'\ | 'rare'\ | 'epic'\ | 'legendary'; RARITY_COLORS (§2.7). **user.ts** — SubscriptionStatus = 'trial'\ | 'active'\ | 'limbo'\ | 'cancelled'; SUBSCRIPTION_PLANS. **database.ts** — placeholder para Supabase generated types (13 tablas, ENUMs). | Archivos existen; `tsc --noEmit` compila; 6 vectores tipados con colores correctos; DAILY_BTC_CAP = 2000 |
| 02.8.3 | 🔄 Crear [ARCHITECTURE.md](http://ARCHITECTURE.md) | [CONFIG] | Estructura de carpetas + responsabilidades (alineado con Tech Spec §4). **Sección de vectores**: 6 vectores con pesos, rangos, colores primario+secundario de Constantes Maestras §2.5 y §5.1. **Sección de personajes**: 6 base avatars con id, key, título, transformación de §5.2. **Sección de tareas**: 17 categorías en 5 arquetipos con valores UP/DOWN/BTC de §5.5. **Sección de niveles**: 12 niveles (10 protocolo + 2 post-game) con min_day, min_score, btc_bonus, health_bonus, fase de §5.3. **Sección de servicios**: 7 servicios (Supabase, Stripe, Gemini, Upstash Redis, Inngest, Sentry, PostHog) + nota sobre Resend post-MVP. Convenciones: PascalCase componentes, camelCase funciones, kebab-case archivos, snake_case DB columns con sufijo _lvl (Tech Spec §9). Orden de imports (Tech Spec §9). Patrones obligatorios: Server Actions (Tech Spec §1.2), Error Handling Result<T,E> (Tech Spec §6.2), Zod boundaries, pure functions en core. Layer diagram. **Sección de colores**: sistema completo de Constantes Maestras §2 (elevación, accent dual, semánticos, texto, vectores, niveles, rareza). | `docs/ARCHITECTURE.md` existe; contiene 6 vectores con colores correctos, 12 niveles, 17 tareas, daily cap 2000 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 02.8.4 | Crear [README.md](http://README.md) | [CONFIG] | One-liner del proyecto. Requisitos (Node 20, pnpm 9). Setup instructions (incluyendo Inngest Dev Server, Supabase local, Upstash). Scripts disponibles (dev, build, test, db:start, db:seed, inngest:dev, services:verify, env:check). Estructura simplificada. Tabla de **6 vectores** con pesos y **colores de Constantes Maestras §2.5**. Lista de **6 personajes** con títulos de §5.2. **12 niveles** con fases. Monetización: Trial $0/5d, Semanal $2.99, Mensual $9.99, Protocolo $29.99 (§1). Link a [ARCHITECTURE.md](http://ARCHITECTURE.md). | [README.md](http://README.md) en raíz; ejecutable por dev nuevo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 02.8.5 | Configurar vercel.json | [CONFIG] | Framework Next.js. buildCommand `pnpm build`. installCommand `pnpm install --frozen-lockfile`. Serverless maxDuration 30s (para Judgement Night processing via Inngest). Cron: ninguno aquí (se usa Inngest per Constantes Maestras §3). Headers de seguridad (CSP, HSTS, X-Frame-Options). Rewrites para Inngest endpoint `/api/inngest`. | Archivo existe; `vercel build` sin error de config |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 02.8.6 | Crear [CHANGELOG.md](http://CHANGELOG.md) | [CONFIG] | Formato Keep a Changelog. Secciones: Added, Changed, Deprecated, Removed, Fixed, Security. Entrada inicial: v0.2.0 — Infraestructura completa (Caja 02). Referencia a cajas como milestones (v0.1.0=Caja01, v0.2.0=Caja02… v0.13.0=Caja13). | [CHANGELOG.md](http://CHANGELOG.md) existe; formato estándar |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 02.8.7 | Crear [CONTRIBUTING.md](http://CONTRIBUTING.md) | [CONFIG] | Guía de contribución: branch naming (feat/xx.y/desc), commit convention (conventional commits con scopes de 02.3.4), PR template, code review checklist (TS strict, Zod validation, Result<T,E>, tests, no any, colores de Constantes Maestras, daily cap 2000 no 3500), testing requirements (80% coverage), scopes permitidos para commits. Prohibiciones: no Replicate, no Resend (post-MVP), no Redis standalone (Upstash OK), no MongoDB/Firebase/tRPC/Prisma. | [CONTRIBUTING.md](http://CONTRIBUTING.md) existe |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 02.8.8 | Crear .github/PULL_REQUEST_[TEMPLATE.md](http://TEMPLATE.md) | [CONFIG] | Template de PR: sección de descripción, checklist (types pass, tests pass, lint pass, bundle < 200KB, no console.log, colores alineados con Constantes Maestras §2, daily_cap = 2000, no refs a Replicate/Resend), caja/subcaja referenciada, screenshots (si UI con vectores/niveles/rarezas), breaking changes. | PRs usan template automáticamente |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 02.8.9 | Crear .github/ISSUE_TEMPLATE/ | [CONFIG] | Templates: bug_[report.md](http://report.md) (pasos para reproducir, expected vs actual, screenshots, browser, vector/task/avatar context con 6 vectores y 6 personajes), feature_[request.md](http://request.md) (descripción, motivación, caja relacionada, vectores afectados de los 6), [task.md](http://task.md) (caja ID, subcaja, tipo [AUTO/MANUAL/CONFIG], criterio de éxito). | Issues usan templates |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 02.8.10 | 🔄 Crear docs/GAME_[MECHANICS.md](http://MECHANICS.md) alineado con Constantes Maestras v2.0.0 | [CONFIG] | Resumen ejecutivo de mecánicas de juego para referencia rápida. **6 vectores** (§5.1): nombres, campos DB, pesos, rangos 0-50 (ENV 1-10), colores primario+secundario de §2.5, fórmula overall score. **6 personajes** (§5.2): id, key, título, transformación, tokens IA de ADRs §5.2. **17 task categories** (§5.5): agrupadas por vector/arquetipo, UP/DOWN simétricos, rep/semana, max_rep_x100, BTC base. **9 tool_types** (§5.9): herramienta, vector, tareas asociadas. **12 niveles** (§5.3): 10 protocolo (INDIGENTE→MAGNATE) + 2 post-game (ÉLITE, SEMI-DIOS), min_day, min_score, btc_bonus, health_bonus, fase (Despertar D1-25 L1-5, Construcción D26-50 L6-7, Transformación D51-75 L8-9, Maestría D76-100 L10), colores de nivel §2.6. **Health Points** (§5.4): 5 inicial, 10 max base, **14 max expandido** (bonus en niveles 3,6,9,12), día ≥80% = +1 HP, <80% = -1 HP. **Economía BTC** (§5.6): daily cap **2,000**, wallet inicial 0, diminishing max(0.25, 0.90^(rep-1)), multiplier = 1.0 + (level×0.05) + streak_bonus + sub_bonus, streak {0:×1.0, 1-7:×1.1, 8-14:×1.5, 15+:×2.5}. **Death** (§5.6): 1ª 30% BTC / 2ª 40% / 3ª+ 50% + hibernación, AURA preservada 30%, reset jawline/wealth/physique/social=0, env=1. **ENV** (§5.8): 10 niveles de entorno, no tiene tarea directa, se modifica via items de tienda tipo upgrade. **Monetización** (§1): Trial $0/5d, Semanal $2.99, Mensual $9.99, Protocolo $29.99, Modo Limbo 7d. **Rarezas** (§2.7): common/rare/epic/legendary con colores. Tabla de quick reference. | Documento existe; todas las mecánicas documentadas con valores de Constantes Maestras v2.0.0 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

---

# ══════════════════════════════════════════════════════════════════════════════

# RESUMEN DE FIXES DE ALINEACIÓN CON CONSTANTES MAESTRAS v2.0.0 (18 total)

# ══════════════════════════════════════════════════════════════════════════════

| # | Discrepancia | Severidad | Valor Anterior (caja_2 v3.0) | Valor Correcto (Constantes v2.0.0) | Tareas Afectadas |
| --- | --- | --- | --- | --- | --- |
| 1 | Color AURA | **ALTO** | `#A78BFA` | `#9B59B6` (§2.5) | 02.1.6, 02.1.11, 02.7.2, 02.8.2, 02.8.10 |
| 2 | Color JAWLINE | **ALTO** | `#F472B6` | `#E74C3C` (§2.5) | 02.1.6, 02.1.11, 02.7.2, 02.8.2, 02.8.10 |
| 3 | Color WEALTH | **ALTO** | `#FBBF24` | `#27AE60` (§2.5) | 02.1.6, 02.1.11, 02.7.2, 02.8.2, 02.8.10 |
| 4 | Color PHYSIQUE | **ALTO** | `#34D399` | `#E67E22` (§2.5) | 02.1.6, 02.1.11, 02.7.2, 02.8.2, 02.8.10 |
| 5 | Color SOCIAL | **ALTO** | `#60A5FA` | `#3498DB` (§2.5) | 02.1.6, 02.1.11, 02.7.2, 02.8.2, 02.8.10 |
| 6 | Color ENV | **ALTO** | `#94A3B8` | `#1ABC9C` (§2.5) | 02.1.6, 02.1.11, 02.7.2, 02.8.2, 02.8.10 |
| 7 | Accent gold | **ALTO** | `#FFD700` | `#D4AF37` (§2.2) | 02.1.6, 02.1.11, 02.6.8, 02.7.2 |
| 8 | Accent CTA | **ALTO** | `#FF3B30` (accent-red) | `#FF073A` (accent-cta — §2.2) | 02.1.6, 02.1.11, 02.6.8, 02.7.2 |
| 9 | bg-primary | MEDIO | `#0A0A0B` | `#0A0A0A` (§2.1: --color-bg-base) | 02.1.6, 02.1.11 |
| 10 | Daily BTC Cap | **CRÍTICO** | 3,500 | **2,000** (§5.6) | 02.4.3, 02.6.7, 02.6.23, 02.7.5, 02.7.7, 02.7.10, 02.8.2, 02.8.10 |
| 11 | Health max expandido | **ALTO** | 13 | **14** (§5.4: 10 base + 4 bonus) | 02.6.23, 02.7.7, 02.8.2, 02.8.10 |
| 12 | Resend | **CRÍTICO** | Servicio activo (3 tareas) | Post-MVP (§3: "evaluar Resend") | 02.5.1, 02.5.2, 02.5.7, 02.6.22-23, 02.6.29-30, 02.8.1 |
| 13 | Stripe precios | **CRÍTICO** | $19.90/mes + $199/año | $2.99/sem + $9.99/mes + $29.99 one-time (§1) | 02.6.11, 02.6.30, 02.7.5, 02.7.7, 02.8.4, 02.8.10 |
| 14 | Niveles count | **ALTO** | "10 niveles" | **12 niveles** (10 protocolo + 2 post-game — §5.3) | 02.4.2, 02.6.26, 02.7.7, 02.8.2, 02.8.3, 02.8.10 |
| 15 | Sistema de colores | **ALTO** | Parcial (solo vectores + personajes) | Completo: elevación(3), accent dual(5), semánticos(4), texto(4), niveles(5), rareza(4) — §2 | 02.1.6, 02.1.11, 02.4.13, 02.6.8, 02.7.2, 02.8.2, 02.8.3 |
| 16 | PostHog feature flag | MEDIO | `enable_social_vector` | `enable_postgame_levels` (SOCIAL es estándar, no en rollout) | 02.6.28, 02.6.30 |
| 17 | Inngest funciones | **ALTO** | 6 funciones (con send-email) | **5 funciones** (sin send-transactional-email) | 02.6.22, 02.6.23, 02.6.24, 02.6.30 |
| 18 | accent-active | MEDIO | No existía | `#00E5FF` (§2.2: nuevo token) | 02.1.6, 02.1.11, 02.7.2 |

---

# ══════════════════════════════════════════════════════════════════════════════

# AUDIT FIXES HEREDADOS (de versiones previas, mantenidos)

# ══════════════════════════════════════════════════════════════════════════════

| # | Hallazgo | Severidad | Tareas | Status |
| --- | --- | --- | --- | --- |
| 1 | Rate limiting in-memory Map() no funciona en serverless | **CRÍTICO** | 02.6.18, 02.6.19, 02.6.20 — Upstash Redis obligatorio | MANTENIDO |
| 2 | Bundle size 512KB vs target 200KB | **CRÍTICO** | 02.1.5, 02.4.8 | MANTENIDO |
| 3 | Replicate reemplazado por Gemini | **CRÍTICO** | 02.5.1, 02.5.2, 02.6.15, 02.6.16 | MANTENIDO |
| 4 | Trivy sin Docker | MEDIO | 02.4.5 — removido | MANTENIDO |
| 5 | Sin política de triage de vulnerabilidades | MEDIO | 02.4.5 — SLA agregado | MANTENIDO |
| 6 | PostCSS/cssnano redundante | BAJO | 02.1.7 | MANTENIDO |
| 7 | Sin política de lockfile | MEDIO | 02.5.4 | MANTENIDO |
| 8 | Sentry tracesSampleRate bajo | MEDIO | 02.6.26 — 0.3 | MANTENIDO |
| 9 | Dependabot major bumps sin control | BAJO | 02.4.9 | MANTENIDO |

---

# ══════════════════════════════════════════════════════════════════════════════

# RESUMEN EJECUTIVO

# ══════════════════════════════════════════════════════════════════════════════

```
CAJA 02 DEFINITIVA v4.0 — ALINEADA CON CONSTANTES MAESTRAS v2.0.0

SERVICIOS EXTERNOS (7):
├── Supabase       → Auth (nativo, emails incluidos), DB (13 tablas), Storage (avatares), Realtime, CLI local
├── Stripe         → Pagos: Semanal $2.99, Mensual $9.99, Protocolo $29.99 (§1), webhooks (4 eventos)
├── Gemini AI      → 2.5 Flash (único proveedor §3, 6 personajes × 6 vectores × 10 ENV tokens)
├── Upstash Redis  → Rate limiting serverless (8 limiters alineados con §5.11) — OVERRIDE propietario
├── Inngest        → 5 funciones: Judgement Night, image gen, cleanup, wallet reset, degradation
├── Sentry         → Error tracking, traces 0.3, breadcrumbs por mecánica de juego
└── PostHog        → Analytics, feature flag (enable_postgame_levels), eventos custom

CONSTANTES ALINEADAS CON FUENTE DE VERDAD (Constantes Maestras v2.0.0):
├── VECTORES: 6 con colores correctos (§2.5)
│   ├── AURA     #9B59B6  peso 0.20  rango 0-50
│   ├── JAWLINE  #E74C3C  peso 0.15  rango 0-50
│   ├── WEALTH   #27AE60  peso 0.20  rango 0-50
│   ├── PHYSIQUE #E67E22  peso 0.20  rango 0-50
│   ├── SOCIAL   #3498DB  peso 0.15  rango 0-50
│   └── ENV      #1ABC9C  peso 0.10  rango 1-10
│
├── DESIGN SYSTEM COMPLETO (§2):
│   ├── Elevación: bg-base #0A0A0A, bg-card #1A1A1A, bg-elevated #2D2D2D
│   ├── Accent Dual: gold #D4AF37, cta #FF073A, active #00E5FF
│   ├── Semánticos: error #FF0000, success #00FF88, warning #FFB800, info #00E5FF
│   ├── Texto: primary #FFFFFF, glow #F8FFFF, secondary #B0B0B0, disabled #808080
│   ├── Niveles: low #95A5A6, mid #8D6E63, high #3498DB, elite #D4AF37, god #9B59B6
│   └── Rarezas: common #95A5A6, rare #3498DB, epic #9B59B6, legendary #D4AF37
│
├── PERSONAJES: 6 (§5.2)
│   ├── 1 EL_RASTAS   "El Gamer Olvidado"
│   ├── 2 EL_GUARRO   "El Cadenero Caído"
│   ├── 3 EL_PECAS    "El Genio Quebrado"
│   ├── 4 EL_GREÑAS   "El Rockero Olvidado"
│   ├── 5 EL_GUERO    "El Galán Pasado"
│   └── 6 EL_LIC      "El Ejecutivo Reemplazado"
│
├── TAREAS: 17 categorías en 5 arquetipos (§5.5)
│   ├── AURA(4):     meditation, thanks, posture, wake_early
│   ├── JAWLINE(3):  facial, voice, cold_shower
│   ├── WEALTH(3):   skill_learning, focus_work, reading
│   ├── PHYSIQUE(3): strength, cardio, hydration
│   └── SOCIAL(4):   talk_friend, family, kegel, journal
│
├── HERRAMIENTAS: 9 tool_types (§5.9)
│
├── NIVELES: 12 (§5.3) — 10 protocolo + 2 post-game
│   ├── Protocolo: INDIGENTE(1) → MAGNATE(10)
│   └── Post-game: ÉLITE(11), SEMI-DIOS(12)
│
├── ECONOMÍA BTC (§5.6):
│   ├── Daily Cap: 2,000 (NO 3,500)
│   ├── Diminishing: max(0.25, 0.90^(rep-1))
│   ├── Multiplier: 1.0 + (level×0.05) + streak_bonus + sub_bonus
│   ├── Streak: {0:×1.0, 1-7:×1.1, 8-14:×1.5, 15+:×2.5}
│   └── Death: 1ª 30%, 2ª 40%, 3ª+ 50% + hibernación
│
├── HEALTH (§5.4):
│   ├── Inicial: 5, Max base: 10, Max expandido: 14 (NO 13)
│   ├── Día ≥80%: +1 HP, streak++
│   └── Día <80%: -1 HP, streak=0
│
├── MONETIZACIÓN (§1):
│   ├── Trial: $0 / 5 días
│   ├── Semanal: $2.99 USD (NO $19.90)
│   ├── Mensual: $9.99 USD
│   ├── Protocolo 100: $29.99 USD
│   └── ❌ NO: Plan Anual, Packs BTC, Early Bird
│
└── EMAILS: Supabase Auth nativo (Resend = Post-MVP per §3)

DISTRIBUCIÓN DE TAREAS POR SUBCAJA:

| Subcaja             | Tareas | AUTO | MANUAL | CONFIG | ALINEACIÓN v2.0.0 |
|---------------------|--------|------|--------|--------|--------------------|
| 02.1 Config         | 12     | 10   | 1      | 1      | 4                  |
| 02.2 Linting        | 8      | 8    | 0      | 0      | 0                  |
| 02.3 Git Hooks      | 5      | 4    | 0      | 1      | 1                  |
| 02.4 CI/CD          | 14     | 14   | 0      | 0      | 3                  |
| 02.5 Variables      | 7      | 4    | 2      | 1      | 3                  |
| 02.6 Servicios      | 30     | 13   | 14     | 3      | 12                 |
| 02.7 Herramientas   | 10     | 10   | 0      | 0      | 4                  |
| 02.8 Estructura     | 10     | 0    | 4      | 6      | 6                  |
| **TOTAL**           | **96** | **63** | **21** | **12** | **33 correcciones** |

CAMBIOS PRINCIPALES vs v3.0:
├── COLORES: 6 vectores corregidos a valores de Constantes Maestras §2.5
├── DESIGN SYSTEM: Expandido con elevación, accent dual, semánticos, texto, niveles, rareza
├── DAILY BTC CAP: 3,500 → 2,000 (§5.6) — corregido en 8 tareas
├── HEALTH MAX: 13 → 14 (§5.4) — corregido en 4 tareas
├── NIVELES: 10 → 12 (10 protocolo + 2 post-game — §5.3)
├── STRIPE PRECIOS: $19.90/mes → $2.99/sem + $9.99/mes + $29.99 one-time (§1)
├── RESEND: Removido (3 tareas) → Reemplazado por Supabase Auth Email (3 tareas)
├── INNGEST: 6 funciones → 5 (removida send-transactional-email)
├── SERVICIOS: 8 → 7 (sin Resend)
├── ENV VARS: 18 → 17 (sin RESEND_API_KEY)
├── POSTHOG FLAG: enable_social_vector → enable_postgame_levels
├── ACCENT: Agregados accent-cta #FF073A, accent-active #00E5FF, accent-gold-hover #B8941F
├── NUEVA TAREA: 02.1.11 CSS custom properties para design tokens
└── TOTAL: 95 → 96 tareas (+1 neta)

CHECKLIST DE CALIDAD PARA AUDITORÍA:
- [x] 6 vectores con colores EXACTOS de Constantes Maestras §2.5
- [x] Design system COMPLETO: elevación(3) + accent dual(5) + semánticos(4) + texto(4) + niveles(5) + rareza(4)
- [x] 6 personajes con tokens IA de ADRs §5.2
- [x] 17 task categories con UP/DOWN/BTC de §5.5
- [x] 9 tool_types con vector associations de §5.9
- [x] 12 niveles (10+2) con min_day/min_score/btc_bonus/health_bonus de §5.3
- [x] Daily BTC Cap = 2,000 (NO 3,500) en TODAS las referencias
- [x] Health max expandido = 14 (NO 13) en TODAS las referencias
- [x] Monetización: Trial $0/5d, Semanal $2.99, Mensual $9.99, Protocolo $29.99
- [x] Upstash Redis MANTENIDO (override del propietario, documentado)
- [x] Resend REMOVIDO de MVP (post-MVP per §3), emails via Supabase Auth nativo
- [x] 0 referencias a Replicate, DALL-E, Fal.ai en todo el codebase
- [x] 0 referencias a Resend en código de MVP
- [x] Inngest: 5 funciones (sin send-transactional-email)
- [x] PostHog: feature flag enable_postgame_levels (no enable_social_vector)
- [x] Overall Score fórmula correcta: AURA×0.20 + JAWLINE×0.15 + WEALTH×0.20 + PHYSIQUE×0.20 + SOCIAL×0.15 + (ENV×5)×0.10
- [x] Stripe: 3 productos (semanal/mensual/protocolo), 4 webhooks, Modo Limbo 7 días
- [x] Todas las variables de entorno documentadas (17) y validadas con Zod
- [x] Pipeline CI/CD completo: lint → type-check → test → security → build → deploy → smoke
- [x] Rate limits alineados con §5.11 (8 endpoints)
- [x] CSS custom properties con notación oficial de Constantes Maestras §2
- [x] Documentación completa: ARCHITECTURE, README, CHANGELOG, CONTRIBUTING, GAME_MECHANICS, EMAIL_ROADMAP
```

---

**FIN DEL DOCUMENTO — CAJA 02 DEFINITIVA v4.0 ALINEADA CON CONSTANTES MAESTRAS v2.0.0**

## 🔍 ANÁLISIS DE DISCREPANCIAS DETECTADAS

Antes de generar el documento, aquí las **contradicciones críticas** entre `caja_2_VFull` actual y la documentación v2.0.0:

| # | Discrepancia | caja_2 actual | Constantes Maestras v2.0.0 (Fuente de verdad) | Acción |
| --- | --- | --- | --- | --- |
| 1 | **Colores de vectores** | AURA #A78BFA, JAWLINE #F472B6, WEALTH #FBBF24, PHYSIQUE #34D399, SOCIAL #60A5FA, ENV #94A3B8 | AURA #9B59B6, JAWLINE #E74C3C, WEALTH #27AE60, PHYSIQUE #E67E22, SOCIAL #3498DB, ENV #1ABC9C | **CORREGIR** |
| 2 | **Accent gold** | #FFD700 | #D4AF37 | **CORREGIR** |
| 3 | **Accent CTA** | accent-red #FF3B30 | accent-cta #FF073A + accent-cta-hover #DC143C | **CORREGIR** |
| 4 | **bg-primary** | #0A0A0B | #0A0A0A | **CORREGIR** |
| 5 | **Daily BTC Cap** | 3,500 (múltiples refs) | 2,000 | **CORREGIR** |
| 6 | **Health max expandido** | 13 (en resumen) | 14 (10 base + 4 bonus) | **CORREGIR** |
| 7 | **Resend** | Servicio activo (3 tareas) | "Post-MVP: evaluar Resend" — Emails via Supabase Auth nativo | **REEMPLAZAR con Supabase Auth Email** |
| 8 | **Redis/Upstash** | Incluido | "❌ Sin Redis" | **MANTENER** (override del usuario) |
| 9 | **Stripe precio mensual** | $19.90 USD/mes | $9.99 USD/mes | **CORREGIR** |
| 10 | **Niveles** | "10 niveles" | 12 niveles (10 protocolo + 2 post-game) | **CORREGIR** |
| 11 | **Sistema de colores** | Parcial (solo vectores + personajes) | Completo: elevación, accent dual, semánticos, texto, niveles, rareza | **EXPANDIR** |
| 12 | **PostHog feature flag** | `enable_social_vector` (rollout gradual) | SOCIAL es vector estándar, no en rollout | **CORREGIR** |
| 13 | **Inngest send-email** | Función que usa Resend | Resend es post-MVP | **REMOVER función** |
| 14 | **Total servicios** | 8 (con Resend) | 7 (sin Resend) | **CORREGIR a 7** |
| 15 | **Env vars** | 18 (con Resend) | 17 (sin Resend, con Upstash) | **CORREGIR a 17** |
| 16 | **accent-active** | No existe | #00E5FF (nuevo) | **AGREGAR** |
| 17 | **Colores de niveles** | No definidos | 5 rangos con HEX específicos | **AGREGAR** |
| 18 | **Colores de rareza** | No definidos | 4 rarezas con HEX | **AGREGAR** |

