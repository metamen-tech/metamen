-- ============================================================
-- METAMEN100 — Migración 004: Funciones de Juego
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- fn_calculate_overall_score
-- Formula: AURA×0.20 + JAWLINE×0.15 + WEALTH×0.20
--        + PHYSIQUE×0.20 + SOCIAL×0.15 + (ENV×5)×0.10
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_calculate_overall_score(
    p_aura      DECIMAL(4,2),
    p_jawline   DECIMAL(4,2),
    p_wealth    DECIMAL(4,2),
    p_physique  DECIMAL(4,2),
    p_social    DECIMAL(4,2),
    p_env       INTEGER
)
RETURNS DECIMAL(5,2) AS $$
BEGIN
    RETURN ROUND(
        (p_aura * 0.20) +
        (p_jawline * 0.15) +
        (p_wealth * 0.20) +
        (p_physique * 0.20) +
        (p_social * 0.15) +
        ((p_env * 5) * 0.10),
        2
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─────────────────────────────────────────────────────────────
-- fn_calculate_level
-- Dual gate: min_score + min_day → nivel 1-12
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_calculate_level(
    p_overall_score DECIMAL(5,2),
    p_current_day   INTEGER
)
RETURNS INTEGER AS $$
BEGIN
    -- Nivel 12: SEMI-DIOS (score >= 45.00, day >= 180)
    IF p_overall_score >= 45.00 AND p_current_day >= 180 THEN RETURN 12; END IF;
    -- Nivel 11: ASCENDIDO (score >= 40.00, day >= 150)
    IF p_overall_score >= 40.00 AND p_current_day >= 150 THEN RETURN 11; END IF;
    -- Nivel 10: MAESTRO (score >= 35.00, day >= 120)
    IF p_overall_score >= 35.00 AND p_current_day >= 120 THEN RETURN 10; END IF;
    -- Nivel 9: GUERRERO (score >= 30.00, day >= 100)
    IF p_overall_score >= 30.00 AND p_current_day >= 100 THEN RETURN 9; END IF;
    -- Nivel 8: VETERANO (score >= 25.00, day >= 80)
    IF p_overall_score >= 25.00 AND p_current_day >= 80 THEN RETURN 8; END IF;
    -- Nivel 7: ESTOICO (score >= 20.00, day >= 60)
    IF p_overall_score >= 20.00 AND p_current_day >= 60 THEN RETURN 7; END IF;
    -- Nivel 6: DISCIPLINADO (score >= 16.00, day >= 45)
    IF p_overall_score >= 16.00 AND p_current_day >= 45 THEN RETURN 6; END IF;
    -- Nivel 5: APRENDIZ (score >= 12.00, day >= 30)
    IF p_overall_score >= 12.00 AND p_current_day >= 30 THEN RETURN 5; END IF;
    -- Nivel 4: INICIADO (score >= 8.00, day >= 14)
    IF p_overall_score >= 8.00 AND p_current_day >= 14 THEN RETURN 4; END IF;
    -- Nivel 3: DESPERTADO (score >= 5.00, day >= 7)
    IF p_overall_score >= 5.00 AND p_current_day >= 7 THEN RETURN 3; END IF;
    -- Nivel 2: REFUGIADO (score >= 2.00, day >= 3)
    IF p_overall_score >= 2.00 AND p_current_day >= 3 THEN RETURN 2; END IF;
    -- Nivel 1: PERDIDO (default)
    RETURN 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─────────────────────────────────────────────────────────────
-- fn_calculate_btc_multiplier
-- Aditivo: 1.0 + (level×0.05) + streak_bonus + sub_bonus
-- Streak escalonado: 0d→+0, 1-7d→+0.1, 8-14d→+0.5, 15+d→+1.5
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_calculate_btc_multiplier(
    p_level         INTEGER,
    p_streak_days   INTEGER,
    p_sub_bonus     DECIMAL(5,2)
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    v_streak_bonus DECIMAL(5,2);
BEGIN
    -- Calcular streak bonus escalonado
    IF p_streak_days >= 15 THEN
        v_streak_bonus := 1.50;
    ELSIF p_streak_days >= 8 THEN
        v_streak_bonus := 0.50;
    ELSIF p_streak_days >= 1 THEN
        v_streak_bonus := 0.10;
    ELSE
        v_streak_bonus := 0.00;
    END IF;

    RETURN ROUND(1.00 + (p_level * 0.05) + v_streak_bonus + p_sub_bonus, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─────────────────────────────────────────────────────────────
-- fn_diminishing_returns
-- max(0.25, 0.90^(rep-1))
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_diminishing_returns(
    p_repetition INTEGER
)
RETURNS DECIMAL(4,2) AS $$
BEGIN
    RETURN ROUND(GREATEST(0.25, POWER(0.90, p_repetition - 1))::DECIMAL(4,2), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─────────────────────────────────────────────────────────────
-- fn_calculate_max_hp
-- 10 + bonus (+1 en niveles 3, 6, 9, 12) → rango 10-14
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_calculate_max_hp(
    p_level INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    v_bonus INTEGER := 0;
BEGIN
    IF p_level >= 12 THEN v_bonus := 4;
    ELSIF p_level >= 9 THEN v_bonus := 3;
    ELSIF p_level >= 6 THEN v_bonus := 2;
    ELSIF p_level >= 3 THEN v_bonus := 1;
    END IF;

    RETURN 10 + v_bonus;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─────────────────────────────────────────────────────────────
-- fn_get_death_btc_loss_pct
-- 1ª→0.30, 2ª→0.40, 3ª+→0.50
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_get_death_btc_loss_pct(
    p_death_count INTEGER
)
RETURNS DECIMAL(3,2) AS $$
BEGIN
    IF p_death_count >= 3 THEN RETURN 0.50; END IF;
    IF p_death_count = 2 THEN RETURN 0.40; END IF;
    RETURN 0.30;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─────────────────────────────────────────────────────────────
-- fn_get_death_aura_preserved
-- ROUND(aura × 0.30, 2)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_get_death_aura_preserved(
    p_aura DECIMAL(4,2)
)
RETURNS DECIMAL(4,2) AS $$
BEGIN
    RETURN ROUND(GREATEST(0, p_aura * 0.30), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
