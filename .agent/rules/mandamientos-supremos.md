# ════════════════════════════════════════════════════════════════════

# RULES.md — METAMEN100 MVP v1.0

# ════════════════════════════════════════════════════════════════════

# Última actualización: 2026-02-19

# Este archivo es LEY. Todo agente de código DEBE leerlo antes de

# escribir una sola línea. Violaciones = revert inmediato.

# ════════════════════════════════════════════════════════════════════

## 1. IDENTIDAD DEL PROYECTO

- **Nombre**: MetaMen100
- **Qué es**: App gamificada de auto-mejora masculina con avatar IA que evoluciona según comportamiento real del usuario
- **North Star**: Usuario llega al Día 6 → ve cambio visual impactante en avatar → paga suscripción
- **Idioma del código**: Inglés (variables, funciones, tipos, commits)
- **Idioma del contenido**: Español mexicano (UI, copy, mensajes de error al usuario)

---

## 2. TECH STACK — NO NEGOCIABLE

| Capa            | Tecnología                     | Versión                                                         |
| --------------- | ------------------------------ | --------------------------------------------------------------- |
| Framework       | Next.js                        | 15 (App Router)                                                 |
| UI              | React                          | 19                                                              |
| Lenguaje        | TypeScript                     | ultra-strict (`strict: true`, `noUncheckedIndexedAccess: true`) |
| Estilos         | Tailwind CSS                   | v4 (CSS-based config)                                           |
| Base de datos   | Supabase (PostgreSQL)          | —                                                               |
| Auth            | Supabase Auth                  | PKCE obligatorio, `flowType: 'pkce'`                            |
| Storage         | Supabase Storage               | Buckets: `avatars` (público)                                    |
| Pagos           | Stripe                         | Checkout Sessions + Webhooks                                    |
| IA Imágenes     | Gemini 2.5 Flash               | Generación visual de avatares                                   |
| Hosting         | Vercel                         | Serverless                                                      |
| Package Manager | pnpm                           | —                                                               |
| Testing         | Vitest + React Testing Library | —                                                               |
| Linting         | ESLint + Prettier              | Config en Caja MVP-02                                           |

### Dependencias MVP aprobadas (únicas permitidas sin autorización):

```
# Core
next react react-dom typescript tailwindcss

# Supabase
@supabase/supabase-js @supabase/ssr

# Forms
react-hook-form @hookform/resolvers zod

# UI
@radix-ui/react-tooltip @radix-ui/react-dialog @radix-ui/react-slot
class-variance-authority clsx tailwind-merge
sonner lucide-react

# Env validation
@t3-oss/env-nextjs

# Testing
vitest @testing-library/react @testing-library/jest-dom fast-check
```

### Dependencias PROHIBIDAS en MVP:

```
❌ framer-motion          → usar CSS transitions
❌ @tanstack/react-query  → Server Components + Suspense bastan
❌ @tanstack/react-virtual → sin Time Matrix en MVP
❌ @upstash/ratelimit     → Supabase Auth rate limiting built-in
❌ @marsidev/react-turnstile → sin CAPTCHA en MVP
❌ bcryptjs               → sin phone verification
❌ prisma                 → Supabase client directo
❌ trpc                   → Server Actions
❌ zustand/jotai/redux    → Server Components + props + useOptimistic
❌ axios                  → fetch nativo
❌ moment/dayjs           → Intl.DateTimeFormat nativo
❌ lodash                 → utils nativos de JS/TS
```

Cualquier dependencia NO listada en "aprobadas" requiere justificación escrita.

---

## 3. ESTRUCTURA DE CARPETAS

```
src/
├── app/
│   ├── (auth)/              # Grupo de rutas públicas de auth
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/         # Grupo de rutas protegidas
│   │   ├── page.tsx         # HQ (dashboard principal)
│   │   ├── protocol/        # Placeholder v1.1
│   │   ├── profile/         # Placeholder v1.1
│   │   └── layout.tsx       # Layout con sidebar, nav, header
│   ├── (protected)/
│   │   └── onboarding/
│   ├── auth/
│   │   └── callback/route.ts # OAuth callback
│   └── layout.tsx           # Root layout
├── actions/                  # Server Actions (ÚNICOS entry points de mutación)
│   ├── auth/
│   ├── onboarding/
│   └── tasks/
├── components/
│   ├── ui/                  # Atoms: Button, Input, Card, Badge, Skeleton, etc.
│   ├── auth/                # Componentes de auth
│   ├── onboarding/          # Wizard, Quiz, Oath
│   ├── dashboard/           # Avatar, StatusCards, VectorBars, TaskList
│   └── layout/              # Sidebar, MobileNav, Header
├── hooks/                   # Custom hooks ('use client' siempre)
├── lib/
│   ├── core/                # Motor de juego — LÓGICA PURA, 0 I/O
│   │   ├── vectors/
│   │   ├── levels/
│   │   ├── health/
│   │   ├── judgement/
│   │   ├── economy/
│   │   ├── types/           # Result<T,E>, branded types
│   │   └── utils/           # invariants
│   ├── supabase/            # Clients: browser.ts, server.ts, middleware.ts
│   ├── validations/         # Zod schemas compartidos client/server
│   ├── constants/           # characters.ts, archetype-quiz.ts, oath.ts
│   └── utils.ts             # cn() utility
├── middleware.ts             # Root middleware — auth guard
└── types/                   # Tipos globales compartidos
```

### Reglas de carpetas:

- Cada directorio tiene `index.ts` como barrel export
- Barrels solo re-exportan API pública, NUNCA funciones internas
- `src/lib/core/` es zona PROHIBIDA de I/O — solo funciones puras
- `src/actions/` es el ÚNICO lugar donde ocurren mutaciones (DB writes)

---

## 4. PATRONES ARQUITECTÓNICOS

### 4.1 Server Components por defecto

```
REGLA: Todo componente es Server Component HASTA que necesite interactividad.
Solo agregar 'use client' cuando el componente usa:
  - useState, useEffect, useRef, useReducer
  - useOptimistic, useTransition
  - onClick, onChange, onSubmit u otros event handlers
  - usePathname, useRouter, useSearchParams
  - Browser APIs (navigator, window, document)

PATRÓN: Client Islands
  - Server Component base renderiza estructura y datos
  - Micro Client Component wraps solo la parte interactiva
  - Ejemplo: AvatarDisplay (Server) → AvatarImage (Client, solo para onError)
```

### 4.2 Data Fetching

```
REGLA: Fetching SIEMPRE en Server Components. NUNCA en client con useEffect.

PATRÓN: Promise.allSettled para queries paralelas
  const [profile, avatar, wallet] = await Promise.allSettled([
    supabase.from('profiles').select('...').single(),
    supabase.from('avatar_states').select('...').single(),
    supabase.from('wallets').select('...').single(),
  ]);
  // Extract con fallbacks:
  const profileData = profile.status === 'fulfilled' ? profile.value.data : null;

PROHIBIDO:
  ❌ Queries encadenadas (waterfall): await query1; await query2;
  ❌ Props drilling de datos desde layout hasta widgets profundos
  ❌ useEffect + fetch en Client Components para data inicial
  ❌ select('*') — siempre seleccionar columnas específicas
```

### 4.3 Server Actions

```
REGLA: Toda mutación pasa por Server Actions en /src/actions/.

ESTRUCTURA OBLIGATORIA:
  1. 'use server' al inicio del archivo
  2. Validar input con Zod (PRIMER paso, antes de cualquier lógica)
  3. Obtener user: supabase.auth.getUser()
  4. Verificar ownership: resource.user_id === user.id
  5. Ejecutar mutación
  6. revalidatePath() si afecta UI
  7. Retornar { success: boolean, error?: string, data?: T }

NUNCA:
  ❌ Retornar mensajes de error internos al usuario
  ❌ Exponer IDs de otros usuarios en errores
  ❌ Mutaciones fuera de Server Actions (no en route handlers excepto webhooks)
```

### 4.4 Suspense per-section

```
REGLA: Cada widget del dashboard tiene su propia Suspense boundary.

<ErrorBoundary fallback={<DashboardErrorFallback />}>
  <Suspense fallback={<AvatarSkeleton />}>
    <AvatarDisplay />
  </Suspense>
</ErrorBoundary>

BENEFICIO: Una query lenta o fallida NO bloquea todo el dashboard.
```

### 4.5 Motor Core — Funciones Puras

```
REGLA: /src/lib/core/ contiene SOLO lógica pura.

PERMITIDO:
  ✅ Cálculos matemáticos
  ✅ Transformaciones de datos
  ✅ Validaciones
  ✅ Result<T,E> monads
  ✅ Constantes y configuración

PROHIBIDO:
  ❌ import de Supabase, fetch, o cualquier I/O
  ❌ import de React o Next.js
  ❌ import de 'server-only' o 'use server'
  ❌ console.log (excepto en tests)
  ❌ throw — usar Result<T,E> monad SIEMPRE
  ❌ Mutación de argumentos — INMUTABILIDAD total (spread, structuredClone)

LAYER ARCHITECTURE:
  Layer 0: types/ (Result, branded), utils/ (invariants)
  Layer 1: vectors/, health/
  Layer 2: levels/, economy/
  Layer 3: judgement/ (ÚNICO módulo que importa de múltiples layers)

  Regla: Layer N solo importa de Layer ≤ N-1. NUNCA ciclos.
```

---

## 5. SISTEMA DE JUEGO — CONSTANTES CLAVE

### 5.1 Vectores (6)

| Vector   | DB Column    | Rango      | Peso | Color      |
| -------- | ------------ | ---------- | ---- | ---------- |
| Aura     | aura_lvl     | 0.00-50.00 | 0.20 | purple-500 |
| Jawline  | jawline_lvl  | 0.00-50.00 | 0.15 | cyan-500   |
| Wealth   | wealth_lvl   | 0.00-50.00 | 0.20 | yellow-500 |
| Physique | physique_lvl | 0.00-50.00 | 0.20 | red-500    |
| Social   | social_lvl   | 0.00-50.00 | 0.15 | orange-500 |
| Entorno  | env_lvl      | 1-10 (int) | 0.10 | green-500  |

**Todos ASCENDENTES**. Suma de pesos = 1.0. Overall Score = Σ(weight × normalizedQuality) × 50 → rango 0-50.

### 5.2 Tareas (17 categorías → 5 arquetipos)

```
MENTAL → AURA:     meditation(+0.50), thanks(+0.50), posture(+1.16), wake_early(+0.50)
FACIAL → JAWLINE:  facial(+1.16), voice(+1.16), cold_shower(+1.78)
ECONOMIC → WEALTH: skill_learning(+0.70), focus_work(+0.70), reading(+0.58)
PHYSICAL → PHYSIQUE: strength(+0.70), cardio(+1.16), hydration(+0.50)
SOCIAL → SOCIAL:   talk_friend(+1.78), family(+1.78), kegel(+0.70), journal(+0.58)
```

### 5.3 Personajes (6)

| ID  | Nombre    | Vector Primario |
| --- | --------- | --------------- |
| 1   | EL RASTAS | SOCIAL          |
| 2   | EL GUARRO | PHYSIQUE        |
| 3   | EL PECAS  | WEALTH          |
| 4   | EL GREÑAS | AURA            |
| 5   | EL GÜERO  | JAWLINE         |
| 6   | EL LIC    | ENV             |

### 5.4 Niveles Clave (13 total)

```
Nivel 1  (Indigente):       day≥1,  score≥0.0    → North Star: día 1
Nivel 3  (Alucín):          day≥6,  score≥10.0   → North Star: MOMENTO DE CONVERSIÓN
Nivel 7  (Hombre Común):    day≥30, score≥28.0
Nivel 10 (Hombre Superior): day≥100, score≥42.0
Nivel 13 (Ascendido):       day≥300, score≥49.0  → Aspiracional post-game
```

### 5.5 Fórmulas Clave

```
Diminishing Returns:  base × max(0.25, 0.90^(rep-1))     → piso 25%
BTC Reward:           base × levelMult × streakMult × subMult × healthPenalty × diminishing
Streak Multiplier:    {0: ×1.0, 1-7: ×1.1, 8-14: ×1.5, 15+: ×2.5}
Health Penalty:       <3 hearts → ×0.5 en todos los gains
Death BTC Loss:       {1st: 30%, 2nd: 40%, 3rd+: 50%}
Aura Preservation:    max(0, currentAura × 0.30) on death
Daily BTC Cap:        3,500 BTC/día
Mercy Rule:           ≥80% completion → no pierdes corazones (streak +1)
```

---

## 6. CONVENCIONES DE CÓDIGO

### 6.1 TypeScript

```typescript
// SIEMPRE: const assertions para enums
const VECTOR_NAME = {
  AURA: 'aura_lvl',
  JAWLINE: 'jawline_lvl',
  // ...
} as const;
type VectorName = (typeof VECTOR_NAME)[keyof typeof VECTOR_NAME];

// NUNCA: TS enums (tree-shaking issues)
// ❌ enum VectorName { AURA = 'aura_lvl' }

// SIEMPRE: interfaces readonly
interface VectorState {
  readonly aura_lvl: number;
  readonly jawline_lvl: number;
  // ...
}

// SIEMPRE: Result<T,E> en lugar de throw
function calculate(x: number): Result<number, CalcError> {
  if (x < 0) return err({ code: 'NEGATIVE', message: 'Must be positive' });
  return ok(x * 2);
}

// NUNCA: throw en lógica de negocio
// ❌ throw new Error('Invalid value');

// SIEMPRE: Branded types para valores de dominio
type VectorValue = number & { readonly __brand: 'VectorValue' };
```

### 6.2 React

```tsx
// Server Component (default — sin directiva)
export default async function StatusCards() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('avatar_states').select('...');
  return <Card>...</Card>;
}

// Client Component (solo cuando necesario)
('use client');
import { useOptimistic, useTransition } from 'react';

export function TaskItem({ task }: { task: DailyTask }) {
  const [optimistic, setOptimistic] = useOptimistic(task);
  const [isPending, startTransition] = useTransition();
  // ...
}

// REGLAS:
// - Props: siempre tipadas con interface, no inline
// - forwardRef en TODOS los componentes que aceptan ref (Input, Button)
// - Exportar como named export, no default (excepto pages y layouts)
// - className composable con cn() utility
```

### 6.3 CSS / Tailwind

```
REGLA: Mobile-first. Touch targets ≥ 44px.

PALETA:
  bg-primary:   #0A0A0B
  bg-secondary: #111113
  bg-tertiary:  #1A1A1D
  text-primary: #FFFFFF
  text-secondary: #A1A1AA
  accent-red:   #FF3B30
  accent-glow:  #FF073A

PROHIBIDO:
  ❌ CSS modules
  ❌ styled-components / emotion
  ❌ Inline styles (excepto width% dinámico en barras de progreso)
  ❌ !important
  ❌ Clases de Tailwind hardcodeadas como string sin cn()
  ❌ Animaciones pesadas sin CSS transitions (no Framer Motion en MVP)
```

### 6.4 Zod Schemas

```typescript
// REGLA: Schemas compartidos client y server
// Archivo: src/lib/validations/auth.ts

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Requiere mayúscula')
    .regex(/[a-z]/, 'Requiere minúscula')
    .regex(/[0-9]/, 'Requiere número'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los términos' }),
  }),
});

// Server Action SIEMPRE valida primero:
export async function registerAction(formData: FormData) {
  'use server';
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, code: 'VALIDATION_ERROR' };
  // ...
}
```

---

## 7. BASE DE DATOS — REGLAS

### 7.1 Tablas Core MVP

```
profiles, avatar_states, wallets, daily_tasks, daily_logs,
subscriptions, image_queue, vector_snapshots,
audit_logs, game_config
```

### 7.2 Reglas

```
- RLS habilitado en TODAS las tablas sin excepción
- Política base: user_id = auth.uid() para SELECT/UPDATE/DELETE
- INSERT: solo via triggers o service_role
- NUNCA delete físico — soft delete con deleted_at
- Timestamps: SIEMPRE timestamptz, NUNCA timestamp
- UUIDs: gen_random_uuid() como PK
- Índices: en TODA columna usada en WHERE o JOIN
- Funciones PL/pgSQL: prefijo fn_ (fn_create_user_records, fn_generate_daily_tasks)
- SEARCH_PATH: SIEMPRE set search_path = '' en funciones (seguridad)
```

### 7.3 Supabase Clients

```
3 clientes, NUNCA intercambiar:

1. Browser Client (src/lib/supabase/client.ts)
   - createBrowserClient() — solo en 'use client' components
   - Usa ANON key (respeta RLS)
   - Para: auth.signInWithOAuth, realtime subscriptions

2. Server Client (src/lib/supabase/server.ts)
   - createServerSupabaseClient() — Server Components + Server Actions
   - Usa ANON key + cookies (respeta RLS con sesión del usuario)
   - Para: queries, mutaciones autenticadas

3. Admin Client (src/lib/supabase/server.ts)
   - createAdminClient() — SOLO webhooks y crons
   - Usa SERVICE_ROLE key (BYPASSES RLS)
   - NUNCA exponer al cliente
   - NUNCA usar en Server Components normales
```

---

## 8. SEGURIDAD — REGLAS

```
- Variables con SERVICE_ROLE, SECRET: NUNCA prefijo NEXT_PUBLIC_
- Server Actions: SIEMPRE verificar auth.getUser() como primer paso
- Server Actions: SIEMPRE verificar resource.user_id === user.id
- OAuth: flowType: 'pkce' obligatorio
- Passwords: validar server-side con Zod (min 8, mayúscula, minúscula, número)
- Errores al usuario: GENÉRICOS ("Email o contraseña incorrectos"), nunca internals
- Registro fallido con trigger: rollback con admin.deleteUser() para evitar huérfanos
- Middleware: valida sesión en TODAS las rutas protegidas
- Console.log: NUNCA loggear tokens, passwords, o datos sensibles
```

---

## 9. TESTING — REGLAS

```
- Vitest como test runner (configurado en Caja MVP-02)
- Coverage target: ≥85% para src/lib/core/
- Coverage target: ≥70% para componentes UI
- Property-based tests (fast-check) para invariantes del motor core
- Tests de Server Actions: mockear Supabase client
- Tests de componentes: React Testing Library (queries por role, no por className)
- NUNCA: tests que dependen de implementación interna
- NUNCA: snapshot tests (frágiles, no verifican comportamiento)
- Test files: colocados en __tests__/ dentro de cada módulo
```

---

## 10. GIT — CONVENCIONES

### Commits

```
Formato: <type>(<scope>): <description>

Types:
  feat     → nueva funcionalidad
  fix      → corrección de bug
  refactor → cambio de código sin cambio de comportamiento
  test     → agregar o modificar tests
  chore    → config, deps, tooling
  docs     → documentación
  style    → formateo, sin cambio de lógica

Scopes: 02 (setup), 03 (db), 04 (core), 05 (auth), 06 (dashboard),
        07 (jn), 08 (ia), 09 (payments)

Ejemplos:
  feat(04): implement vector calculation engine
  fix(05): handle orphan user on failed trigger
  test(04): add property-based tests for clamp
  chore(02): configure vitest and eslint
```

### Branches

```
main                → producción
feat/caja-XX-desc   → feature por caja
fix/issue-desc      → hotfix
```

---

## 11. PERFORMANCE — BUDGETS

```
- LCP < 1.5s en /dashboard (target 1.2s)
- FCP < 0.8s
- CLS = 0 (Skeletons con mismas dimensiones que contenido final)
- Bundle JS inicial < 150KB (sin framer-motion, sin tanstack)
- Images: WebP, lazy load (excepto avatar = priority)
- Fonts: Inter via next/font (local, no Google Fonts fetch)
- Suspense per-section: cada widget independiente
- Promise.allSettled: queries paralelas, nunca secuenciales
```

---

## 12. ORDEN DE EJECUCIÓN MVP

```
Caja MVP-01: Decisiones de scope (COMPLETADA — cuestionario)
Caja MVP-02: Proyecto base (Next.js, TS, Tailwind, Supabase, Vitest, ESLint)
Caja MVP-03: Base de datos (10 tablas, RLS, triggers, funciones PL/pgSQL)
Caja MVP-04: Motor Core (vectores, niveles, salud, JN, economía — 0 I/O)
Caja MVP-05: Auth & Onboarding (register, login, OAuth, wizard, middleware)
Caja MVP-06: Dashboard & Task UI (layout, avatar, vectores, tareas, trial overlay)
Caja MVP-07: Judgement Night Integration (cron que conecta core engine con DB)
Caja MVP-08: Generación IA (Gemini prompts, image queue processing)
Caja MVP-09: Pagos (Stripe Checkout, webhooks, subscription management)
Caja MVP-10: Deploy & Launch (Vercel, env prod, monitoring básico)
```

---

## 13. COSAS QUE NO SON MVP (v1.1+)

```
❌ Phone verification (Twilio, SMS, OTP)
❌ Rate limiting con Redis (Upstash)
❌ CAPTCHA (Cloudflare Turnstile)
❌ Time Matrix (100 días grid virtualizado)
❌ Realtime avatar updates (Supabase Realtime)
❌ Sound system (AudioContext)
❌ Haptic patterns
❌ Animation queue
❌ Framer Motion animations
❌ TanStack React Query (offline-first)
❌ Death screen overlay
❌ Limbo overlay
❌ Arsenal (herramientas)
❌ Store (marketplace BTC)
❌ Social features
❌ Achievements / logros
❌ i18n
❌ Sentry error tracking
❌ Decay (degradación de vectores)
❌ Vector gating (requisitos por vector para items)
❌ E2E tests (Playwright)
❌ Password recovery flow
❌ Account linking (merge OAuth + email)
```

---

## 14. REGLA FINAL — FILOSOFÍA

```
CÓDIGO > DOCUMENTOS
Si tienes duda entre documentar más o escribir código: ESCRIBE CÓDIGO.

80/20 BRUTAL
Si una feature no impacta la ruta Trial → Día 6 → Pago: NO ENTRA.

VERTICAL SLICE
Un flujo completo funcionando > 10 módulos parcialmente implementados.

DÍA 6 = NORTH STAR
Todo gira alrededor de que el usuario llegue al Día 6 con un avatar
visualmente transformado que lo haga decir "necesito seguir con esto".
```
