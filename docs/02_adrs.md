# METAMEN100 — ADRs v2.0.0 (DESARROLLO)

**Versión:** 2.0.0 LEAN | **Fecha:** 22 Feb 2026 | **Fuente de verdad:** Constantes Maestras v2.0.0

---

## 1. PRINCIPIOS ARQUITECTÓNICOS

1. **Pureza funcional** — `Input → Cálculo → Output`. Sin I/O en lógica de negocio.
2. **Inmutabilidad** — Estados `readonly`. Cada operación retorna nuevo estado.
3. **Type Safety** — Branded types, discriminated unions, Zod en boundaries.
4. **Error handling** — `Result<T, E>` monad. Nunca `throw` en funciones puras.
5. **Composabilidad** — Funciones pequeñas en pipelines.
6. **Seguridad por diseño** — RLS, SECURITY DEFINER, validación en cada capa.

---

## 2. STACK TECNOLÓGICO

### 2.1 Core Stack

| Categoría       | Tecnología                          | Versión              |
| --------------- | ----------------------------------- | -------------------- |
| Framework       | Next.js (App Router)                | `^15.0.0`            |
| UI Library      | React                               | `^19.0.0`            |
| Language        | TypeScript                          | `^5.7.0` (strict)    |
| Styling         | Tailwind CSS                        | `^4.0.0`             |
| Componentes     | shadcn/ui                           | latest               |
| Animaciones     | Framer Motion                       | `^11.15.0`           |
| Base de datos   | PostgreSQL via Supabase             | 15+                  |
| Auth            | Supabase Auth                       | latest               |
| ORM             | Supabase generated types            | —                    |
| Migraciones     | Supabase CLI                        | latest               |
| Pagos           | Stripe                              | `^17.0.0`            |
| IA/Imágenes     | Gemini 2.5 Flash                    | latest               |
| Colas           | Inngest + BullMQ (backup)           | `^3.0.0` / `^5.34.0` |
| Cache           | React Query + Next.js Data Cache    | —                    |
| Storage         | Supabase Storage                    | —                    |
| Emails          | Supabase Auth (nativo)              | —                    |
| Observabilidad  | Sentry + PostHog + Vercel Analytics | —                    |
| Hosting         | Vercel                              | —                    |
| Package Manager | pnpm                                | latest               |

### 2.2 Dependencias Frontend

| Paquete                    | Versión    |
| -------------------------- | ---------- |
| `next`                     | `^15.0.0`  |
| `react`                    | `^19.0.0`  |
| `tailwindcss`              | `^4.0.0`   |
| `framer-motion`            | `^11.15.0` |
| `class-variance-authority` | `^0.7.0`   |
| `clsx`                     | `^2.0.0`   |
| `tailwind-merge`           | `^2.0.0`   |
| `lucide-react`             | `^0.469.0` |
| `recharts`                 | `^2.15.0`  |
| `immer`                    | `^10.0.0`  |
| `zustand`                  | `^5.0.0`   |

### 2.3 Dependencias Backend

| Paquete                 | Versión   |
| ----------------------- | --------- |
| `@supabase/supabase-js` | `^2.47.0` |
| `@supabase/ssr`         | `^0.5.0`  |
| `inngest`               | `^3.0.0`  |
| `bullmq`                | `^5.34.0` |
| `@google/generative-ai` | `^0.21.0` |
| `stripe`                | `^17.0.0` |
| `zod`                   | `^3.23.0` |
| `react-hook-form`       | `^7.54.0` |
| `@hookform/resolvers`   | `^3.9.0`  |
| `date-fns`              | `^4.1.0`  |
| `date-fns-tz`           | `^3.2.0`  |
| `uuid`                  | `^11.0.0` |

### 2.4 Dev Tools

| Paquete                  | Versión   |
| ------------------------ | --------- |
| `typescript`             | `^5.7.0`  |
| `vitest`                 | `^2.1.0`  |
| `fast-check`             | `^3.0.0`  |
| `@testing-library/react` | `^16.1.0` |
| `playwright`             | `^1.40.0` |
| `eslint`                 | `^9.17.0` |
| `prettier`               | `^3.4.0`  |
| `husky`                  | latest    |
| `supabase`               | `^2.0.0`  |

### 2.5 Tecnologías PROHIBIDAS

| Tecnología                  | Razón                                    |
| --------------------------- | ---------------------------------------- |
| MongoDB / Firebase          | Sin RLS nativo, vendor lock-in           |
| tRPC + Prisma               | Server Actions + PG Functions suficiente |
| DALL-E / Replicate / Fal.ai | Gemini 2.5 Flash es único proveedor      |
| Cloudflare R2               | Supabase Storage suficiente              |
| Resend                      | Supabase Auth nativo                     |
| Redis standalone            | React Query + Next.js Data Cache         |
| Python Backend              | Elimina type safety E2E                  |

---

## 3. ESTRUCTURA DE CARPETAS

```
metamen100/
├── app/
│   ├── (auth)/login/, register/, callback/
│   ├── (dashboard)/
│   │   ├── dashboard/, avatar/, tasks/
│   │   ├── tools/ (9 herramientas)
│   │   ├── shop/, inventory/, settings/
│   └── api/webhooks/stripe/
├── components/
│   ├── ui/ (shadcn)
│   ├── tools/, avatar/, vectors/
├── lib/
│   ├── core/ (MOTOR PURO - cero I/O)
│   │   ├── types/, vectors/, levels/
│   │   ├── health/, judgement/, economy/
│   │   ├── state-machines/, validation/
│   ├── supabase/
│   │   ├── client.ts, server.ts
│   │   ├── server-component.ts, middleware.ts
│   └── actions/
│       ├── tasks.ts, store.ts, inventory.ts
│       ├── tools.ts, avatar.ts, notifications.ts
├── types/
│   ├── database.types.ts (generated)
│   └── custom.types.ts
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── tests/unit/, integration/, e2e/
```

---

## 4. BASE DE DATOS

### 4.1 ENUMs PostgreSQL

```sql
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');

CREATE TYPE task_category AS ENUM (
  'meditation', 'thanks', 'posture', 'wake_early',
  'facial', 'voice', 'cold_shower',
  'skill_learning', 'focus_work', 'reading',
  'strength', 'cardio', 'hydration',
  'talk_friend', 'family', 'kegel', 'journal'
);

CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'limbo', 'cancelled');

CREATE TYPE item_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');

CREATE TYPE image_gen_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'retrying');

CREATE TYPE notification_type AS ENUM (
  'task_completed', 'level_up', 'streak_milestone',
  'health_warning', 'health_critical', 'avatar_died',
  'image_ready', 'trial_expiring', 'payment_failed', 'general'
);

CREATE TYPE tool_type AS ENUM (
  'meditation', 'focus_timer', 'lookmaxing', 'journal',
  'logbook', 'kegel', 'posture', 'metagym', 'voice'
);
```

### 4.2 Tablas (13)

| Tabla                    | Columnas clave                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profiles`               | id, nickname, email, base_avatar_id (1-6), locale, timezone, onboarding_completed, deleted_at                                                     |
| `avatar_states`          | user_id, aura_lvl, jawline_lvl, wealth_lvl, physique_lvl, social_lvl, env_lvl, health_points, current_level, streak_days, last_image_url, version |
| `wallets`                | user_id, btc_balance, total_earned, total_spent, today_earned, daily_cap (2000), version                                                          |
| `subscriptions`          | user_id, status, trial_starts_at, trial_ends_at, stripe_customer_id, stripe_subscription_id, current_period_end                                   |
| `daily_tasks`            | user_id, task_category, task_type, status, vector_modifiers (JSONB), btc_reward, completed_at, expires_at                                         |
| `daily_logs`             | user_id, day_number, log_date, vectors_snapshot (JSONB), day_status, health_delta, btc_earned                                                     |
| `store_items`            | id, name, category, rarity, price_btc, level_required, vector_requirements (JSONB), ai_token, is_active                                           |
| `inventory`              | user_id, item_id, is_equipped, equipped_slot, locked_by_death, acquired_at                                                                        |
| `tool_progress`          | user_id, tool_type, sessions_count, total_duration_seconds, tool_data (JSONB)                                                                     |
| `image_generation_queue` | user_id, base_avatar_id, vectors_snapshot (JSONB), equipped_items_tokens, status, result_url, attempts                                            |
| `notifications`          | user_id, type, title, message, is_read, read_at, expires_at                                                                                       |
| `activity_logs`          | user_id, action, entity_type, entity_id, metadata (JSONB), ip_address, user_agent                                                                 |
| `idempotency_keys`       | key, user_id, action, status, result (JSONB), expires_at                                                                                          |

### 4.3 Funciones PostgreSQL (SECURITY DEFINER)

```sql
-- Trigger de registro
fn_create_user_records()

-- Lógica de negocio
fn_complete_task_transaction()
fn_process_judgement_night()
fn_apply_vector_degradation()
fn_process_avatar_death()
fn_purchase_item_transaction()
fn_spend_btc_safe()
fn_calculate_btc_multiplier()

-- Utilidades
fn_get_or_create_idempotency_key()
fn_cleanup_expired_idempotency_keys()
fn_wallets_reset_daily()
```

### 4.4 Trigger de Registro

```sql
CREATE OR REPLACE FUNCTION fn_create_user_records()
RETURNS TRIGGER AS $$
DECLARE
  v_nickname TEXT;
BEGIN
  v_nickname := 'METAMEN-' || LPAD(nextval('nickname_seq')::TEXT, 4, '0');

  INSERT INTO profiles (id, nickname, email, base_avatar_id, locale, timezone)
  VALUES (NEW.id, v_nickname, NEW.email, 1, 'es-MX', 'America/Mexico_City');

  INSERT INTO avatar_states (
    user_id, aura_lvl, jawline_lvl, wealth_lvl,
    physique_lvl, social_lvl, env_lvl, health_points
  ) VALUES (NEW.id, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 5);

  INSERT INTO wallets (user_id, btc_balance, daily_cap)
  VALUES (NEW.id, 0, 2000);

  INSERT INTO subscriptions (user_id, status, trial_starts_at, trial_ends_at)
  VALUES (NEW.id, 'trial', NOW(), NOW() + INTERVAL '5 days');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_create_user_records();
```

### 4.5 RLS Policies

```sql
-- profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- avatar_states: solo lectura directa, escritura via SECURITY DEFINER
CREATE POLICY "avatar_states_select" ON avatar_states FOR SELECT USING (auth.uid() = user_id);

-- wallets: solo lectura directa
CREATE POLICY "wallets_select" ON wallets FOR SELECT USING (auth.uid() = user_id);

-- daily_tasks
CREATE POLICY "daily_tasks_select" ON daily_tasks FOR SELECT USING (auth.uid() = user_id);

-- store_items: público para lectura
CREATE POLICY "store_items_select" ON store_items FOR SELECT USING (is_active = true);

-- inventory
CREATE POLICY "inventory_select" ON inventory FOR SELECT USING (auth.uid() = user_id);
```

---

## 5. GENERACIÓN IA — GEMINI 2.5 FLASH

### 5.1 Pipeline

```
1. fn_process_judgement_night() → vectors_snapshot
2. INSERT INTO image_generation_queue
3. Inngest worker 'process-image-queue'
4. Construir prompt: [CHARACTER_TOKENS] + [VECTOR_TOKENS] + [ITEMS_TOKENS] + [ENV_TOKENS]
5. POST a Gemini API
6. Guardar → Supabase Storage: /avatars/{user_id}/{YYYY-MM-DD}.webp
7. UPDATE avatar_states SET last_image_url = ...
8. INSERT INTO notifications (type = 'image_ready')
```

### 5.2 Tokens Personajes (6)

| ID  | Key         | Tokens                                                                                        |
| --- | ----------- | --------------------------------------------------------------------------------------------- |
| 1   | `EL_RASTAS` | `"brown dreadlocks, thick locks, round face, friendly eyes, warm brown skin"`                 |
| 2   | `EL_GUARRO` | `"bald, shaved head, square jaw, small eyes, thick neck, tan skin"`                           |
| 3   | `EL_PECAS`  | `"curly red-brown hair, messy, freckles, thin face, sharp features, pale skin with freckles"` |
| 4   | `EL_GREÑAS` | `"balding with long hair in back, goatee, angular face, deep set eyes, weathered skin"`       |
| 5   | `EL_GUERO`  | `"blonde wavy hair, styled back, strong jaw, blue eyes, handsome, fair skin"`                 |
| 6   | `EL_LIC`    | `"black hair, receding hairline, rectangular glasses, stubble, tired eyes, olive skin"`       |

### 5.3 Tokens ENV (10 niveles)

| ENV | Token                                              |
| --- | -------------------------------------------------- |
| 1   | `"dark dirty street, trash, homeless setting"`     |
| 2   | `"dark alley, dim streetlight, urban decay"`       |
| 3   | `"cramped shared room, bunk bed, messy"`           |
| 4   | `"small studio apartment, basic furniture"`        |
| 5   | `"comfortable apartment, modern furniture"`        |
| 6   | `"own house, nice living room, garden"`            |
| 7   | `"modern house, designer interior, pool"`          |
| 8   | `"urban penthouse, city skyline view, luxury"`     |
| 9   | `"mansion, marble floors, chandelier, estate"`     |
| 10  | `"luxury penthouse, panoramic view, gold accents"` |

### 5.4 Retry Policy

- 3 intentos: 1s, 5s, 30s (exponential backoff)
- Si falla: `status = 'failed'`, mantener imagen anterior
- Storage: `/avatars/{user_id}/{YYYY-MM-DD}.webp` (WebP)

---

## 6. COLAS — INNGEST + BULLMQ

```typescript
// 1. Judgement Night (cron horario)
inngest.createFunction(
  { id: 'judgement-night-cron' },
  { cron: '0 * * * *' },
  // Procesa usuarios cuyo timezone marca 23:59, batch 50
);

// 2. Generación de imágenes (event-driven)
inngest.createFunction(
  { id: 'process-image-queue', retries: 3 },
  { event: 'image/generate.requested' },
  // Llama Gemini 2.5 Flash
);

// 3. Cleanup idempotency_keys (cada 6h)
inngest.createFunction({ id: 'cleanup-cron' }, { cron: '0 */6 * * *' });

// 4. Reset diario wallets
inngest.createFunction(
  { id: 'daily-wallet-reset' },
  { cron: '5 0 * * *' },
  // Resetea today_earned a 0
);
```

**BullMQ** como backup si Inngest falla.

---

## 7. SUSCRIPCIÓN Y PAGOS

### 7.1 Planes

| Plan          | Precio      | Tipo        |
| ------------- | ----------- | ----------- |
| Trial         | $0 (5 días) | Sin tarjeta |
| Semanal       | $2.99 USD   | Recurrente  |
| Mensual       | $9.99 USD   | Recurrente  |
| Protocolo 100 | $29.99 USD  | One-time    |

**❌ NO EXISTEN:** Plan Anual, Packs BTC Premium, Early Bird

### 7.2 Flujo de Estados

```
REGISTRO
  └→ trial (5 días)
       ├→ Pago exitoso → active
       │    └→ invoice.payment_failed → limbo (7 días)
       │         ├→ Pago recuperado → active
       │         └→ 7 días → cancelled
       └→ No paga → cancelled
```

### 7.3 Stripe Webhooks (4)

| Evento                          | Acción               |
| ------------------------------- | -------------------- |
| `checkout.session.completed`    | status = 'active'    |
| `invoice.paid`                  | Renovar periodo      |
| `invoice.payment_failed`        | status = 'limbo'     |
| `customer.subscription.deleted` | status = 'cancelled' |

---

## 8. SEGURIDAD

### 8.1 Capas

| Capa         | Implementación                            |
| ------------ | ----------------------------------------- |
| Transporte   | TLS 1.3, HSTS                             |
| Auth         | JWT + refresh tokens rotativos (Supabase) |
| Autorización | RLS + SECURITY DEFINER                    |
| Validación   | Zod en Server Actions                     |
| Auditoría    | activity_logs                             |

### 8.2 Rate Limits

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

### 8.3 Datos Sensibles

- Passwords: bcrypt via Supabase Auth
- Teléfonos: AES-256 en reposo
- Stripe: Solo stripe_customer_id/subscription_id

---

## 9. CACHÉ

### Nivel 1 — React Query (cliente)

- `avatar_state`, `daily_tasks`, `wallet`, `notifications`
- `staleTime`: 30s para avatar, 0 para wallet

### Nivel 2 — Next.js Data Cache

- `store_items`: `revalidate: 3600`
- Configuración niveles: estática

### NUNCA cachear

- `btc_balance`
- `daily_tasks` durante completado
- `avatar_states` durante Judgement Night

---

## 10. OBSERVABILIDAD

| Herramienta      | Función                          |
| ---------------- | -------------------------------- |
| Sentry           | Error tracking, crash reporting  |
| PostHog          | Product analytics, feature flags |
| Vercel Analytics | Web Vitals, performance          |

### Alertas

| Condición     | Umbral            |
| ------------- | ----------------- |
| Error rate    | > 1%              |
| Latencia DB   | > 500ms           |
| Cola imágenes | > 1000 pendientes |

---

## 11. TESTING

### Pirámide

```
Motor Core (70%): Vitest + fast-check (property-based)
API/DB (20%):     Vitest + Supabase test DB
Flujos E2E (10%): Playwright
```

### Coverage Targets

| Capa              | Target    |
| ----------------- | --------- |
| Motor Core        | 100%      |
| Server Actions    | 80%       |
| Componentes React | 60%       |
| E2E críticos      | Cubiertos |

---

## 12. CONVENCIONES

### Result Monad

```typescript
// ✅ CORRECTO
{ ok: true, value: T }
{ ok: false, error: E }

// ❌ INCORRECTO (deprecado)
{ success: true, data: T }
```

### Branded Types

```typescript
type VectorValue = number & { readonly __brand: 'VectorValue' };
type LevelNumber = number & { readonly __brand: 'LevelNumber' };
type BtcAmount = number & { readonly __brand: 'BtcAmount' };
type UserId = string & { readonly __brand: 'UserId' };
```

### Naming

| Elemento      | Convención   | Ejemplo                 |
| ------------- | ------------ | ----------------------- |
| DB columns    | snake_case   | `aura_lvl`              |
| DB indexes    | prefix idx\_ | `idx_profiles_user_id`  |
| Vector fields | sufijo \_lvl | `jawline_lvl`           |
| Componentes   | PascalCase   | `AvatarCard`            |
| Funciones     | camelCase    | `calculateOverallScore` |

---

**FIN DEL DOCUMENTO — ADRs LEAN v2.0.0**
