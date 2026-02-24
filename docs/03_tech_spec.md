# METAMEN100 — TECH SPEC v2.0.0 (DESARROLLO)

**Versión:** 2.0.0 LEAN | **Fecha:** 22 Feb 2026 | **Fuente de verdad:** Constantes Maestras v2.0.0

---

## 1. ARQUITECTURA

### 1.1 Capas

**CLIENT:** Next.js 15 App Router + React 19 + Zustand 5 + TanStack Query 5 + Tailwind 4 + Framer Motion 11

**SERVER:** Server Actions + API Routes (solo webhooks)

**DATA:** Supabase PostgreSQL 15+ (13 tablas, RLS, ~30 políticas)

**EXTERNAL:** Gemini 2.5 Flash (único IA), Stripe, Inngest, BullMQ, Supabase Auth/Storage, Sentry, PostHog, Vercel

### 1.2 Server Actions

`auth` | `tasks` | `store` | `profile` | `wallet` | `tools` | `avatar` | `journal`

### 1.3 API Routes

```
POST /api/webhooks/stripe
GET /api/cron/judgement (Inngest trigger)
```

---

## 2. CONSTANTES DEL DOMINIO

### 2.1 Vectores (6)

| Vector   | Campo DB       | Escala     | Peso |
| -------- | -------------- | ---------- | ---- |
| AURA     | `aura_lvl`     | 0.00–50.00 | 20%  |
| JAWLINE  | `jawline_lvl`  | 0.00–50.00 | 15%  |
| WEALTH   | `wealth_lvl`   | 0.00–50.00 | 20%  |
| PHYSIQUE | `physique_lvl` | 0.00–50.00 | 20%  |
| SOCIAL   | `social_lvl`   | 0.00–50.00 | 15%  |
| ENV      | `env_lvl`      | 1–10 (int) | 10%  |

**Overall Score:**

```
overall = AURA×0.20 + JAWLINE×0.15 + WEALTH×0.20 + PHYSIQUE×0.20 + SOCIAL×0.15 + (ENV×5)×0.10
```

### 2.2 Tareas → Vectores (17)

| Vector   | Tarea            | UP    | DOWN  | Rep/Semana | BTC |
| -------- | ---------------- | ----- | ----- | ---------- | --- |
| AURA     | `meditation`     | +0.50 | −0.50 | 7          | 50  |
| AURA     | `thanks`         | +0.50 | −0.50 | 7          | 40  |
| AURA     | `posture`        | +1.16 | −1.16 | 3          | 60  |
| AURA     | `wake_early`     | +0.50 | −0.50 | 7          | 50  |
| JAWLINE  | `facial`         | +1.16 | −1.16 | 3          | 80  |
| JAWLINE  | `voice`          | +1.16 | −1.16 | 3          | 70  |
| JAWLINE  | `cold_shower`    | +1.78 | −1.78 | 2          | 100 |
| WEALTH   | `skill_learning` | +0.70 | −0.70 | 5          | 80  |
| WEALTH   | `focus_work`     | +0.70 | −0.70 | 5          | 80  |
| WEALTH   | `reading`        | +0.58 | −0.58 | 6          | 60  |
| PHYSIQUE | `strength`       | +0.70 | −0.70 | 5          | 100 |
| PHYSIQUE | `cardio`         | +1.16 | −1.16 | 3          | 90  |
| PHYSIQUE | `hydration`      | +0.50 | −0.50 | 7          | 40  |
| SOCIAL   | `talk_friend`    | +1.78 | −1.78 | 2          | 70  |
| SOCIAL   | `family`         | +1.78 | −1.78 | 2          | 70  |
| SOCIAL   | `kegel`          | +0.70 | −0.70 | 5          | 60  |
| SOCIAL   | `journal`        | +0.58 | −0.58 | 6          | 50  |

### 2.3 Niveles (12)

| Nivel | Nombre       | Min Day | Min Score | BTC Bonus | HP Bonus |
| ----- | ------------ | ------- | --------- | --------- | -------- |
| 1     | INDIGENTE    | 1       | 0.0       | 0         | 0        |
| 2     | REFUGIADO    | 3       | 4.0       | 200       | 0        |
| 3     | MANTENIDO    | 6       | 10.0      | 500       | +1       |
| 4     | ALUCÍN       | 10      | 15.0      | 1,000     | 0        |
| 5     | PEÓN         | 15      | 20.0      | 1,500     | 0        |
| 6     | HOMBRE COMÚN | 25      | 25.0      | 2,000     | +1       |
| 7     | INFLUYENTE   | 35      | 30.0      | 2,500     | 0        |
| 8     | PUDIENTE     | 50      | 35.0      | 3,500     | 0        |
| 9     | MILLONARIO   | 70      | 40.0      | 5,000     | +1       |
| 10    | MAGNATE      | 100     | 45.0      | 10,000    | 0        |
| 11    | ÉLITE        | 150     | 47.0      | 25,000    | 0        |
| 12    | SEMI-DIOS    | 200     | 49.0      | 50,000    | +1       |

**Fases:** Despertar (D1-25, L1-5) → Construcción (D26-50, L6-7) → Transformación (D51-75, L8-9) → Maestría (D76-100, L10)

### 2.4 Economía BTC

| Parámetro           | Valor                     |
| ------------------- | ------------------------- |
| Daily Cap           | 2,000 BTC/día             |
| Wallet Inicial      | 0 BTC                     |
| Diminishing Returns | `max(0.25, 0.90^(rep-1))` |

**Multiplier (aditivo):** `1.0 + (level × 0.05) + streak_bonus + sub_bonus`

**Streak:**
| Días | Bonus |
|------|-------|
| 0 | ×1.0 |
| 1–7 | ×1.1 |
| 8–14 | ×1.5 |
| 15+ | ×2.5 |

### 2.5 Health Points

| Parámetro        | Valor           |
| ---------------- | --------------- |
| Inicial          | 5               |
| Máximo base      | 10              |
| Máximo expandido | 14              |
| ≥80% día         | +1 HP, streak+1 |
| <80% día         | −1 HP, streak=0 |

### 2.6 Muerte

| # Muerte | BTC Loss | AURA Preservada   |
| -------- | -------- | ----------------- |
| 1ª       | 30%      | 30%               |
| 2ª       | 40%      | 30%               |
| 3ª+      | 50%      | 30% + hibernación |

**Reset:** jawline=0, wealth=0, physique=0, social=0, env=1. Items: `locked_by_death=true`.

### 2.7 Herramientas (9)

| #   | Herramienta          | Vector   | Tareas           |
| --- | -------------------- | -------- | ---------------- |
| 1   | Cámara de Meditación | AURA     | meditation       |
| 2   | Focus Chamber        | WEALTH   | focus_work       |
| 3   | MetaGym              | PHYSIQUE | strength, cardio |
| 4   | Journal              | SOCIAL   | journal          |
| 5   | Logbook              | WEALTH   | reading          |
| 6   | Kegel                | SOCIAL   | kegel            |
| 7   | Lookmaxing           | JAWLINE  | facial           |
| 8   | Posture              | AURA     | posture          |
| 9   | Voice                | JAWLINE  | voice            |

---

## 3. FLUJOS CRÍTICOS

### 3.1 Completar Tarea

```
1. Cliente → optimistic UI
2. Server Action: completeTask({ taskId, idempotencyKey, tool_data? })
3. fn_complete_task_transaction():
   a. Verificar idempotency_key
   b. SELECT daily_tasks, avatar_states, wallets FOR UPDATE
   c. Calcular multiplier: 1.0 + (level × 0.05) + streak_bonus + sub_bonus
   d. Calcular diminishing: max(0.25, 0.90^(rep-1))
   e. Aplicar vector_modifiers (clamp 0-50, ENV 1-10)
   f. Verificar daily cap (2,000)
   g. UPDATE wallet, INSERT activity_logs
4. revalidatePath('/dashboard')
5. Cliente: actualizar UI, animación BTC
```

**Response:**

```typescript
{
  ok: true,
  value: {
    taskId: TaskId,
    btcEarned: BtcAmount,
    newBalance: BtcAmount,
    vectorChanges: { aura, jawline, wealth, physique, social, env },
    newStreakMultiplier: number,
    newLevel?: LevelNumber
  }
}
```

### 3.2 Judgement Night

```
TRIGGER: Inngest cron 23:59 timezone usuario (batch 50)

fn_process_judgement_night(user_id, day_number):
1. pg_try_advisory_xact_lock(user_id)
2. SELECT avatar_states FOR UPDATE
3. Calcular rate: completed / total
4. Determinar status:
   - rate >= 0.80 → 'completed' (éxito)
   - rate < 0.80 → 'failed'
5. Aplicar consecuencias:
   - Éxito: streak++, HP = MIN(hp+1, max)
   - Fallo: streak=0, HP−1
6. Si HP=0 → fn_process_avatar_death()
7. INSERT daily_logs
8. INSERT image_generation_queue → Gemini 2.5 Flash
9. RETURN { day_status, health_change, streak_change }
```

---

## 4. ESTRUCTURA DE CARPETAS

```
/metamen100/
├── supabase/migrations/, functions/, seed.sql
├── public/images/avatars/, items/, ui/ + audio/
├── src/
│   ├── app/
│   │   ├── (auth)/login/, register/
│   │   ├── (dashboard)/dashboard/, tools/, store/, profile/
│   │   ├── api/webhooks/stripe/route.ts
│   │   ├── api/cron/judgement/route.ts
│   │   └── page.tsx, layout.tsx, globals.css
│   ├── components/ui/, layout/, dashboard/, tools/, charts/
│   ├── hooks/
│   ├── lib/
│   │   ├── core/ (LÓGICA PURA)
│   │   │   ├── vectors/types.ts, constants.ts, calculations.ts
│   │   │   ├── levels/, health/, judgement/, economy/
│   │   │   ├── state-machines/, validation/
│   │   │   └── types/result.ts, branded.ts
│   │   ├── server/actions/auth/, tasks/, store/, tools/, profile/
│   │   └── supabase/client.ts, middleware.ts
│   ├── stores/auth-store.ts, avatar-store.ts, wallet-store.ts
│   ├── types/database.ts, api.ts
│   └── workers/image-generation.ts
└── tests/unit/, integration/, e2e/
```

---

## 5. CONTRATOS DE API

### 5.1 Server Actions

**Auth:**

```typescript
signUp(data: SignUpInput): Promise<Result<{ userId, email }>>
signIn(data: SignInInput): Promise<Result<{ user, session }>>
signOut(): Promise<Result<void>>
resetPassword(email: string): Promise<Result<void>>
```

**Tasks:**

```typescript
completeTask(input: CompleteTaskInput): Promise<Result<CompleteTaskOutput>>
getDailyTasks(date?: Date): Promise<Result<DailyTask[]>>

type CompleteTaskInput = {
  taskId: TaskId;
  idempotencyKey: IdempotencyKey;
  completionNotes?: string;      // max 500 chars
  actualDurationMinutes?: number; // 1–480
  toolData?: Record<string, unknown>;
};
```

**Store:**

```typescript
purchaseItem(input: PurchaseItemInput): Promise<Result<PurchaseItemOutput>>
getStoreCatalog(filters?: StoreFilters): Promise<Result<StoreItem[]>>

type PurchaseItemInput = {
  itemId: StoreItemId;
  idempotencyKey: IdempotencyKey;
};
```

**Tools:**

```typescript
saveToolProgress(input: SaveToolProgressInput): Promise<Result<SaveToolProgressOutput>>
getToolProgress(toolId: ToolId): Promise<Result<ToolProgress>>
```

### 5.2 Stripe Webhook

```typescript
// POST /api/webhooks/stripe
// Header: stripe-signature

type StripeEventType =
  | 'checkout.session.completed' // → status = 'active'
  | 'invoice.paid' // → renovar periodo
  | 'invoice.payment_failed' // → status = 'limbo'
  | 'customer.subscription.deleted'; // → status = 'cancelled'
```

---

## 6. TIPOS COMPARTIDOS

### 6.1 ENUMs

```typescript
type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
type SubscriptionStatus = 'trial' | 'active' | 'limbo' | 'cancelled';
type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
type VectorType = 'AURA' | 'JAWLINE' | 'WEALTH' | 'PHYSIQUE' | 'SOCIAL' | 'ENV';
type LevelNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type TaskCategory =
  | 'meditation'
  | 'thanks'
  | 'posture'
  | 'wake_early'
  | 'facial'
  | 'voice'
  | 'cold_shower'
  | 'skill_learning'
  | 'focus_work'
  | 'reading'
  | 'strength'
  | 'cardio'
  | 'hydration'
  | 'talk_friend'
  | 'family'
  | 'kegel'
  | 'journal';

type ToolId =
  | 'MEDITATION'
  | 'FOCUS_TIMER'
  | 'LOOKMAXING'
  | 'JOURNAL'
  | 'LOGBOOK'
  | 'KEGEL'
  | 'POSTURE'
  | 'METAGYM'
  | 'VOICE';
```

### 6.2 Result Monad

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
```

### 6.3 Branded Types

```typescript
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
type Branded<T, B> = T & Brand<B>;

type UserId = Branded<string, 'UserId'>;
type TaskId = Branded<string, 'TaskId'>;
type StoreItemId = Branded<string, 'StoreItemId'>;
type IdempotencyKey = Branded<string, 'IdempotencyKey'>;
type BtcAmount = Branded<number, 'BtcAmount'>;
type VectorValue = Branded<number, 'VectorValue'>;
```

---

## 7. CÓDIGO CORE

### 7.1 calculateOverallScore

```typescript
export function calculateOverallScore(vectors: VectorState): Result<number> {
  if (!isValidVectorState(vectors)) return err(new Error('Invalid vector state'));

  const score =
    vectors.aura * 0.2 +
    vectors.jawline * 0.15 +
    vectors.wealth * 0.2 +
    vectors.physique * 0.2 +
    vectors.social * 0.15 +
    vectors.env * 5 * 0.1;

  return ok(Math.round(score * 100) / 100);
}
```

### 7.2 calculateBtcMultiplier

```typescript
export function calculateBtcMultiplier(
  level: LevelNumber,
  streakDays: number,
  hasSubscription: boolean,
): number {
  const levelBonus = level * 0.05;
  const streakBonus = getStreakBonus(streakDays);
  const subBonus = hasSubscription ? 0.2 : 0;

  return 1.0 + levelBonus + streakBonus + subBonus;
}

function getStreakBonus(days: number): number {
  if (days >= 15) return 1.5;
  if (days >= 8) return 0.5;
  if (days >= 1) return 0.1;
  return 0;
}
```

### 7.3 calculateDiminishingReturns

```typescript
export function calculateDiminishingReturns(baseValue: number, repetitionCount: number): number {
  const multiplier = Math.max(0.25, Math.pow(0.9, repetitionCount));
  return baseValue * multiplier;
}
```

### 7.4 applyDailyCap

```typescript
export function applyDailyCap(btcEarned: number, btcEarnedToday: number): number {
  const remaining = Math.max(0, 2000 - btcEarnedToday);
  return Math.min(btcEarned, remaining);
}
```

### 7.5 calculateDeathPenalty

```typescript
export function calculateDeathPenalty(
  deathCount: number,
  currentBtc: number,
  currentAura: number,
): { btcLoss: number; newAura: number; triggerHibernation: boolean } {
  const btcLossRate = deathCount === 0 ? 0.3 : deathCount === 1 ? 0.4 : 0.5;

  return {
    btcLoss: Math.floor(currentBtc * btcLossRate),
    newAura: Math.round(currentAura * 0.3 * 100) / 100,
    triggerHibernation: deathCount >= 2,
  };
}
```

---

## 8. VARIABLES DE ENTORNO

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Gemini
GOOGLE_AI_API_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Observability
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 9. CONVENCIONES

### Naming

| Elemento    | Convención         | Ejemplo                 |
| ----------- | ------------------ | ----------------------- |
| Componentes | PascalCase         | `AvatarCard`            |
| Funciones   | camelCase          | `calculateOverallScore` |
| Constantes  | SCREAMING_SNAKE    | `DAILY_CAP_BTC`         |
| Tipos       | PascalCase         | `VectorState`           |
| DB columns  | snake_case + \_lvl | `aura_lvl`              |
| DB indexes  | idx\_ prefix       | `idx_profiles_user_id`  |

### Imports

```typescript
// 1. React
// 2. Librerías externas
// 3. Componentes internos (@/components)
// 4. Hooks internos (@/hooks)
// 5. Core logic (@/lib/core)
// 6. Tipos (interface Props)
// 7. Constantes locales
// 8. Componente principal
```

### Rate Limits

| Endpoint       | Límite  |
| -------------- | ------- |
| Login          | 5/hora  |
| Register       | 3/hora  |
| Verify Phone   | 3/hora  |
| Password Reset | 3/hora  |
| Complete Task  | 50/hora |
| Read Tasks     | 100/min |
| Store Purchase | 10/min  |
| Store Browse   | 100/min |

---

**FIN DEL DOCUMENTO — TECH SPEC LEAN v2.0.0**
