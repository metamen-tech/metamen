-- ============================================================
-- METAMEN100 — Migración 005: Task Vector Config
-- ============================================================
-- Tabla de referencia: mapeo tarea → vector + valores

CREATE TABLE task_vector_config (
    category        task_category PRIMARY KEY,
    target_vector   VARCHAR(20)  NOT NULL,
    up_value        DECIMAL(4,2) NOT NULL,
    btc_base        INTEGER      NOT NULL
);

INSERT INTO task_vector_config (category, target_vector, up_value, btc_base) VALUES
    ('meditation',     'aura',     0.50,  50),
    ('thanks',         'aura',     0.50,  40),
    ('posture',        'aura',     1.16,  60),
    ('wake_early',     'aura',     0.50,  50),
    ('facial',         'jawline',  1.16,  80),
    ('voice',          'jawline',  1.16,  70),
    ('cold_shower',    'jawline',  1.78, 100),
    ('skill_learning', 'wealth',   0.70,  80),
    ('focus_work',     'wealth',   0.70,  80),
    ('reading',        'wealth',   0.58,  60),
    ('strength',       'physique', 0.70, 100),
    ('cardio',         'physique', 1.16,  90),
    ('hydration',      'physique', 0.50,  40),
    ('talk_friend',    'social',   1.78,  70),
    ('family',         'social',   1.78,  70),
    ('kegel',          'social',   0.70,  60),
    ('journal',        'social',   0.58,  50);
