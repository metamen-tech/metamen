-- ============================================================
-- METAMEN100 — Migración 001: ENUMs del Data Model v2.0.0
-- ============================================================

-- Estado de suscripción del usuario
CREATE TYPE subscription_status AS ENUM (
    'trial',
    'active',
    'limbo',
    'cancelled'
);

-- Estado de una tarea individual
CREATE TYPE task_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'failed'
);

-- Resultado del día en Judgement Night
CREATE TYPE day_status AS ENUM (
    'completed',
    'failed',
    'skipped'
);

-- 17 categorías de tareas diarias
CREATE TYPE task_category AS ENUM (
    'meditation',
    'thanks',
    'posture',
    'wake_early',
    'facial',
    'voice',
    'cold_shower',
    'skill_learning',
    'focus_work',
    'reading',
    'strength',
    'cardio',
    'hydration',
    'talk_friend',
    'family',
    'kegel',
    'journal'
);

-- 9 tipos de herramientas del arsenal
CREATE TYPE tool_type AS ENUM (
    'meditation',
    'focus_timer',
    'lookmaxing',
    'journal',
    'logbook',
    'kegel',
    'posture',
    'metagym',
    'voice'
);

-- Tipos de items de la tienda
CREATE TYPE store_item_type AS ENUM (
    'clothing',
    'accessory',
    'upgrade',
    'cosmetic'
);

-- Rarezas de items
CREATE TYPE item_rarity AS ENUM (
    'common',
    'rare',
    'epic',
    'legendary'
);

-- Estado de generación de imágenes IA
CREATE TYPE image_generation_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);

-- Tipos de notificaciones
CREATE TYPE notification_type AS ENUM (
    'task_reminder',
    'streak_at_risk',
    'death_warning',
    'level_up',
    'item_unlocked',
    'daily_summary',
    'system'
);

-- Estado de idempotency keys
CREATE TYPE idempotency_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);
