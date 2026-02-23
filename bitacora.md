# METAMEN100 — BITÁCORA DE PROYECTO

# ══════════════════════════════════════════════════════════════

# Este documento es el ESTADO VIVO del proyecto.

# Todo agente DEBE leerlo al inicio de cada sesión.

# Todo agente DEBE actualizarlo después de cada tarea completada.

# ══════════════════════════════════════════════════════════════

## ESTADO GENERAL

| Campo                   | Valor                                            |
| ----------------------- | ------------------------------------------------ |
| Fase actual             | MVP v1.0                                         |
| Caja en curso           | **CAJA MVP-02: Infraestructura**                 |
| Última tarea completada | `02.1.3` — Configurar package.json completo      |
| Próxima tarea           | `02.1.4` — Configurar tsconfig.json ultra-strict |
| Bloqueadores            | Ninguno                                          |
| Fecha inicio proyecto   | 2026-02-21                                       |
| Último commit           | `74f6b6b` — feat(02.1.3)                         |
| Branch                  | main                                             |

## MAPA DE PROGRESO

```
CAJA MVP-02: Infraestructura     [▓░░░░░░░░░] 3/96  ← EN CURSO
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
| Next.js 15    | ✅ Configurado | Next.js 16.1.6 (cumple >=15.1)        |
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

### [02.1.2] — Inicializar proyecto Next.js 15

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-22 13:03
- **Tipo**: [AUTO/SCRIPT]
- **Archivos creados/modificados**: .gitignore, eslint.config.mjs, next.config.ts, package.json, pnpm-lock.yaml, pnpm-workspace.yaml, postcss.config.mjs, public/, src/, tsconfig.json
- **Tests**: N/A (tarea de scaffold)
- **Validación**: `pnpm dev` inicia en `http://localhost:3000`; alias `@/*` activo; lockfile `pnpm-lock.yaml` presente; Next.js 16.1.6 (cumple >=15.1); React 19.2.3 ✅; TypeScript presente ✅
- **Commit**: `b2409ca` — chore(02-infra): initialize Next.js 15 project with App Router
- **Notas**: Inicialización en raíz requirió workaround por restricción de nombre npm en `metaMen_Tech` (mayúsculas); se generó temporalmente y se aplicó en raíz preservando documentación.

### [02.1.3] — Configurar package.json completo

- **Estado**: ✅ COMPLETADA
- **Fecha**: 2026-02-22 16:35
- **Tipo**: [AUTO/SCRIPT]
- **Archivos creados/modificados**: package.json, pnpm-lock.yaml
- **Tests**: N/A (tarea de configuración)
- **Validación**: `pnpm install` exit 0 ✅; 15/15 scripts presentes ✅; engines estrictos (node>=20, pnpm>=9) ✅; Next.js/React fijados con tilde (~) ✅; pnpm.overrides.sharp ✅; 27 dependencies + 17 devDependencies
- **Commit**: Pendiente
- **Notas**: BullMQ incluido per especificación de Caja 02 como backup de Inngest. Warning no-crítico en bin de supabase CLI (ENOENT bin path). 3 subdependencias deprecated (no críticas).

---

## ISSUES Y DEUDA TÉCNICA

<!-- Registrar aquí problemas encontrados que no se resuelven en la tarea actual -->

_Sin issues registrados._

---

## NOTAS DE SESIÓN

<!-- Cada sesión de trabajo debe agregar una entrada aquí -->

- 2026-02-22 13:00 — Verificada tarea 02.1.1 (Node.js v20.18.0 + pnpm 10.28.2).
- 2026-02-22 13:03 — Completada tarea 02.1.2 (scaffold Next.js + validación de arranque y estructura).
- 2026-02-22 16:35 — Completada tarea 02.1.3 (package.json completo: engines, 15 scripts, 27+17 deps).
