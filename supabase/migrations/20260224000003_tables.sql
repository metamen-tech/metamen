-- ============================================================
-- METAMEN100 — Migración 003: 13 Tablas del Data Model v2.0.0
-- ============================================================
-- Orden por dependencias: tablas sin FK primero, luego con FK.

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES (FK → auth.users)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname        TEXT NOT NULL UNIQUE DEFAULT fn_generate_nickname(),
    email           TEXT NOT NULL,
    base_avatar_id  INTEGER NOT NULL CHECK (base_avatar_id BETWEEN 1 AND 6),
    display_name    TEXT,
    timezone        TEXT NOT NULL DEFAULT 'America/Mexico_City',
    quiz_answers    JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 2. AVATAR_STATES (estado del juego por usuario)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE avatar_states (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

    -- 5 vectores directos (0.00 – 50.00)
    aura_lvl                DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (aura_lvl BETWEEN 0.00 AND 50.00),
    jawline_lvl             DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (jawline_lvl BETWEEN 0.00 AND 50.00),
    wealth_lvl              DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (wealth_lvl BETWEEN 0.00 AND 50.00),
    physique_lvl            DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (physique_lvl BETWEEN 0.00 AND 50.00),
    social_lvl              DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (social_lvl BETWEEN 0.00 AND 50.00),

    -- Vector derivado ENV (1-10, = nivel del personaje)
    env_lvl                 INTEGER NOT NULL DEFAULT 1 CHECK (env_lvl BETWEEN 1 AND 10),

    -- Salud
    health_points           INTEGER NOT NULL DEFAULT 5 CHECK (health_points BETWEEN 0 AND 14),
    max_health_points       INTEGER NOT NULL DEFAULT 10 CHECK (max_health_points BETWEEN 10 AND 14),

    -- Niveles y progreso
    current_level           INTEGER NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 12),
    current_day             INTEGER NOT NULL DEFAULT 0,
    total_days_completed    INTEGER NOT NULL DEFAULT 0,

    -- Streak
    streak_days             INTEGER NOT NULL DEFAULT 0,
    max_streak_days         INTEGER NOT NULL DEFAULT 0,

    -- Muerte
    death_count             INTEGER NOT NULL DEFAULT 0,

    -- Multiplicador BTC actual
    current_btc_multiplier  DECIMAL(5,2) NOT NULL DEFAULT 1.00,

    -- Optimistic locking
    version                 INTEGER NOT NULL DEFAULT 1,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_avatar_states_updated_at
    BEFORE UPDATE ON avatar_states
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 3. WALLETS (economía BTC)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE wallets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    btc_balance     INTEGER NOT NULL DEFAULT 0 CHECK (btc_balance >= 0),
    total_earned    INTEGER NOT NULL DEFAULT 0,
    total_spent     INTEGER NOT NULL DEFAULT 0,
    today_earned    INTEGER NOT NULL DEFAULT 0,
    daily_cap       INTEGER NOT NULL DEFAULT 2000,
    last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
    version         INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 4. SUBSCRIPTIONS (Stripe)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    status              subscription_status NOT NULL DEFAULT 'trial',
    plan_type           TEXT,
    stripe_customer_id  TEXT,
    stripe_subscription_id TEXT,
    trial_start         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    trial_end           TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 days'),
    current_period_start TIMESTAMPTZ,
    current_period_end  TIMESTAMPTZ,
    cancel_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 5. DAILY_TASKS (tareas diarias)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE daily_tasks (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category                task_category NOT NULL,
    day_number              INTEGER NOT NULL CHECK (day_number > 0),
    status                  task_status NOT NULL DEFAULT 'pending',
    btc_reward              INTEGER NOT NULL DEFAULT 0,
    completed_at            TIMESTAMPTZ,

    -- 6 columnas de modificación vectorial
    aura_modification       DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    jawline_modification    DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    wealth_modification     DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    physique_modification   DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    social_modification     DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    env_modification        DECIMAL(4,2) NOT NULL DEFAULT 0.00,

    repetition_number       INTEGER NOT NULL DEFAULT 1,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, category, day_number)
);

CREATE TRIGGER trg_daily_tasks_updated_at
    BEFORE UPDATE ON daily_tasks
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 6. DAILY_LOGS (historial de Judgement Night)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE daily_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    day_number          INTEGER NOT NULL CHECK (day_number > 0),
    day_status          day_status NOT NULL,
    completion_pct      DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    tasks_completed     INTEGER NOT NULL DEFAULT 0,
    tasks_total         INTEGER NOT NULL DEFAULT 0,
    btc_earned          INTEGER NOT NULL DEFAULT 0,

    -- Snapshots vectoriales
    aura_snapshot       DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    jawline_snapshot    DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    wealth_snapshot     DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    physique_snapshot   DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    social_snapshot     DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    env_snapshot        INTEGER NOT NULL DEFAULT 1,

    health_points       INTEGER NOT NULL DEFAULT 0,
    level_snapshot      INTEGER NOT NULL DEFAULT 1,

    completed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, day_number)
);

-- ─────────────────────────────────────────────────────────────
-- 7. STORE_ITEMS (catálogo tienda)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE store_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    description     TEXT,
    item_type       store_item_type NOT NULL,
    rarity          item_rarity NOT NULL DEFAULT 'common',
    btc_price       INTEGER NOT NULL CHECK (btc_price > 0),
    level_required  INTEGER NOT NULL DEFAULT 1 CHECK (level_required BETWEEN 1 AND 12),
    image_url       TEXT,

    -- Requisitos vectoriales opcionales
    aura_required       DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    jawline_required    DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    wealth_required     DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    physique_required   DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    social_required     DECIMAL(4,2) NOT NULL DEFAULT 0.00,

    -- Tokens IA para prompt de avatar
    ai_prompt_tokens    TEXT,

    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_store_items_updated_at
    BEFORE UPDATE ON store_items
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 8. INVENTORY (items del usuario)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    store_item_id   UUID NOT NULL REFERENCES store_items(id) ON DELETE CASCADE,
    is_equipped     BOOLEAN NOT NULL DEFAULT false,
    locked_by_death BOOLEAN NOT NULL DEFAULT false,
    purchased_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, store_item_id)
);

-- ─────────────────────────────────────────────────────────────
-- 9. TOOL_PROGRESS (progreso en herramientas)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tool_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tool            tool_type NOT NULL,
    total_sessions  INTEGER NOT NULL DEFAULT 0,
    total_minutes   INTEGER NOT NULL DEFAULT 0,
    tool_data       JSONB DEFAULT '{}',
    last_used_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, tool)
);

CREATE TRIGGER trg_tool_progress_updated_at
    BEFORE UPDATE ON tool_progress
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 10. IMAGE_GENERATION_QUEUE (cola IA)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE image_generation_queue (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    day_number      INTEGER NOT NULL,
    prompt          TEXT NOT NULL,
    reference_image_url TEXT,
    status          image_generation_status NOT NULL DEFAULT 'pending',
    result_url      TEXT,
    error_message   TEXT,
    retries         INTEGER NOT NULL DEFAULT 0,
    max_retries     INTEGER NOT NULL DEFAULT 3,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_image_generation_queue_updated_at
    BEFORE UPDATE ON image_generation_queue
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 11. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type            notification_type NOT NULL,
    title           TEXT NOT NULL,
    body            TEXT,
    is_read         BOOLEAN NOT NULL DEFAULT false,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 12. ACTIVITY_LOGS (audit trail)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action          TEXT NOT NULL,
    entity_type     TEXT NOT NULL,
    entity_id       UUID,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 13. IDEMPOTENCY_KEYS (operaciones críticas)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE idempotency_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key             TEXT NOT NULL UNIQUE,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status          idempotency_status NOT NULL DEFAULT 'pending',
    request_path    TEXT NOT NULL,
    request_body    JSONB,
    response_body   JSONB,
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_idempotency_keys_updated_at
    BEFORE UPDATE ON idempotency_keys
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Índices de rendimiento
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_daily_tasks_user_day ON daily_tasks(user_id, day_number);
CREATE INDEX idx_daily_tasks_status ON daily_tasks(status);
CREATE INDEX idx_daily_logs_user_day ON daily_logs(user_id, day_number);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_image_queue_status ON image_generation_queue(status);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_idempotency_keys_key ON idempotency_keys(key);
CREATE INDEX idx_idempotency_keys_expires ON idempotency_keys(expires_at);
