-- ============================================================
-- METAMEN100 — Migración 006: Funciones Transaccionales
-- ============================================================
-- Funciones compuestas que ejecutan transacciones de juego.

-- ─────────────────────────────────────────────────────────────
-- fn_complete_task_transaction
-- Completa una tarea: actualiza vector, wallet, y marca tarea.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_complete_task_transaction(
    p_user_id    UUID,
    p_category   task_category,
    p_day_number INTEGER
)
RETURNS TABLE (
    success       BOOLEAN,
    btc_earned    INTEGER,
    vector_name   TEXT,
    old_value     DECIMAL(4,2),
    new_value     DECIMAL(4,2),
    capped        BOOLEAN
) AS $$
DECLARE
    v_task_id        UUID;
    v_config         RECORD;
    v_avatar         RECORD;
    v_wallet         RECORD;
    v_repetition     INTEGER;
    v_multiplier     DECIMAL(5,2);
    v_diminishing    DECIMAL(4,2);
    v_btc_raw        INTEGER;
    v_btc_final      INTEGER;
    v_old_val        DECIMAL(4,2);
    v_new_val        DECIMAL(4,2);
    v_was_capped     BOOLEAN := false;
    v_col_name       TEXT;
BEGIN
    -- 1. Obtener y validar tarea pendiente
    SELECT dt.id, dt.repetition_number INTO v_task_id, v_repetition
    FROM daily_tasks dt
    WHERE dt.user_id = p_user_id
      AND dt.category = p_category
      AND dt.day_number = p_day_number
      AND dt.status = 'pending';

    IF v_task_id IS NULL THEN
        RETURN QUERY SELECT false, 0, ''::TEXT, 0.00::DECIMAL(4,2), 0.00::DECIMAL(4,2), false;
        RETURN;
    END IF;

    -- 2. Obtener config del vector
    SELECT * INTO v_config FROM task_vector_config WHERE category = p_category;

    -- 3. Obtener avatar state actual (con lock optimista)
    SELECT * INTO v_avatar FROM avatar_states WHERE user_id = p_user_id FOR UPDATE;

    -- 4. Obtener wallet (con lock optimista)
    SELECT * INTO v_wallet FROM wallets WHERE user_id = p_user_id FOR UPDATE;

    -- Reset daily cap si cambió el día
    IF v_wallet.last_reset_date < CURRENT_DATE THEN
        UPDATE wallets SET today_earned = 0, last_reset_date = CURRENT_DATE WHERE user_id = p_user_id;
        v_wallet.today_earned := 0;
    END IF;

    -- 5. Calcular BTC con multiplicador y diminishing returns
    v_multiplier := fn_calculate_btc_multiplier(v_avatar.current_level, v_avatar.streak_days, 0.00);
    v_diminishing := fn_diminishing_returns(v_repetition);
    v_btc_raw := FLOOR(v_config.btc_base * v_diminishing * v_multiplier);

    -- Aplicar daily cap
    v_btc_final := LEAST(v_btc_raw, v_wallet.daily_cap - v_wallet.today_earned);
    IF v_btc_final < 0 THEN v_btc_final := 0; END IF;

    -- 6. Calcular modificación vectorial con clamping
    v_col_name := v_config.target_vector || '_lvl';

    -- Obtener valor actual del vector
    EXECUTE format('SELECT %I FROM avatar_states WHERE user_id = $1', v_col_name)
        INTO v_old_val USING p_user_id;

    -- Calcular nuevo valor con clamp según tipo de vector
    IF v_config.target_vector = 'env' THEN
        v_new_val := LEAST(GREATEST(v_old_val + v_config.up_value, 1), 10);
    ELSE
        v_new_val := LEAST(GREATEST(v_old_val + v_config.up_value, 0.00), 50.00);
    END IF;

    v_was_capped := (v_old_val + v_config.up_value) <> v_new_val;

    -- 7. Actualizar avatar_states
    EXECUTE format('UPDATE avatar_states SET %I = $1, version = version + 1 WHERE user_id = $2', v_col_name)
        USING v_new_val, p_user_id;

    -- 8. Actualizar wallet
    UPDATE wallets SET
        btc_balance = btc_balance + v_btc_final,
        total_earned = total_earned + v_btc_final,
        today_earned = today_earned + v_btc_final,
        version = version + 1
    WHERE user_id = p_user_id;

    -- 9. Marcar tarea completada con modificaciones
    UPDATE daily_tasks SET
        status = 'completed',
        completed_at = NOW(),
        btc_reward = v_btc_final,
        aura_modification = CASE WHEN v_config.target_vector = 'aura' THEN v_config.up_value ELSE 0 END,
        jawline_modification = CASE WHEN v_config.target_vector = 'jawline' THEN v_config.up_value ELSE 0 END,
        wealth_modification = CASE WHEN v_config.target_vector = 'wealth' THEN v_config.up_value ELSE 0 END,
        physique_modification = CASE WHEN v_config.target_vector = 'physique' THEN v_config.up_value ELSE 0 END,
        social_modification = CASE WHEN v_config.target_vector = 'social' THEN v_config.up_value ELSE 0 END
    WHERE id = v_task_id;

    -- 10. Retornar resultado
    RETURN QUERY SELECT true, v_btc_final, v_config.target_vector::TEXT, v_old_val, v_new_val, v_was_capped;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- fn_process_judgement_night
-- Procesa el juicio nocturno: HP, streak, muerte, daily_log.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_process_judgement_night(
    p_user_id    UUID,
    p_day_number INTEGER
)
RETURNS TABLE (
    result_status     day_status,
    completion_pct    DECIMAL(5,2),
    hp_change         INTEGER,
    new_hp            INTEGER,
    new_streak        INTEGER,
    death_occurred    BOOLEAN,
    btc_lost          INTEGER
) AS $$
DECLARE
    v_total_tasks     INTEGER;
    v_completed_tasks INTEGER;
    v_pct             DECIMAL(5,2);
    v_day_status      day_status;
    v_avatar          RECORD;
    v_hp_delta        INTEGER;
    v_new_hp          INTEGER;
    v_new_streak      INTEGER;
    v_death           BOOLEAN := false;
    v_btc_lost        INTEGER := 0;
    v_overall_score   DECIMAL(5,2);
    v_new_level       INTEGER;
    v_new_max_hp      INTEGER;
BEGIN
    -- 1. Contar tareas del día
    SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
    INTO v_total_tasks, v_completed_tasks
    FROM daily_tasks
    WHERE user_id = p_user_id AND day_number = p_day_number;

    IF v_total_tasks = 0 THEN
        v_pct := 0.00;
        v_day_status := 'skipped';
    ELSE
        v_pct := ROUND((v_completed_tasks::DECIMAL / v_total_tasks) * 100, 2);
        IF v_pct >= 80.00 THEN
            v_day_status := 'completed';
        ELSE
            v_day_status := 'failed';
        END IF;
    END IF;

    -- 2. Obtener avatar state (con lock)
    SELECT * INTO v_avatar FROM avatar_states WHERE user_id = p_user_id FOR UPDATE;

    -- 3. Ajustar HP según resultado del día
    IF v_day_status = 'completed' THEN
        v_hp_delta := 1;
        v_new_hp := LEAST(v_avatar.health_points + 1, v_avatar.max_health_points);
        v_new_streak := v_avatar.streak_days + 1;
    ELSE
        v_hp_delta := -1;
        v_new_hp := GREATEST(v_avatar.health_points - 1, 0);
        v_new_streak := 0;
    END IF;

    -- 4. Verificar muerte (HP = 0)
    IF v_new_hp = 0 THEN
        v_death := true;
        DECLARE
            v_death_count INTEGER;
            v_loss_pct    DECIMAL(3,2);
            v_wallet      RECORD;
            v_aura_preserved DECIMAL(4,2);
        BEGIN
            v_death_count := v_avatar.death_count + 1;
            v_loss_pct := fn_get_death_btc_loss_pct(v_death_count);

            SELECT * INTO v_wallet FROM wallets WHERE user_id = p_user_id FOR UPDATE;
            v_btc_lost := FLOOR(v_wallet.btc_balance * v_loss_pct);

            UPDATE wallets SET
                btc_balance = btc_balance - v_btc_lost,
                version = version + 1
            WHERE user_id = p_user_id;

            v_aura_preserved := fn_get_death_aura_preserved(v_avatar.aura_lvl);

            UPDATE avatar_states SET
                aura_lvl = v_aura_preserved,
                jawline_lvl = 0.00,
                wealth_lvl = 0.00,
                physique_lvl = 0.00,
                social_lvl = 0.00,
                env_lvl = 1,
                health_points = 5,
                death_count = v_death_count,
                streak_days = 0,
                current_btc_multiplier = 1.00,
                version = version + 1
            WHERE user_id = p_user_id;

            v_new_hp := 5;
            v_new_streak := 0;
        END;
    ELSE
        -- Recalcular nivel y max HP si no murió
        v_overall_score := fn_calculate_overall_score(
            v_avatar.aura_lvl, v_avatar.jawline_lvl, v_avatar.wealth_lvl,
            v_avatar.physique_lvl, v_avatar.social_lvl, v_avatar.env_lvl
        );
        v_new_level := fn_calculate_level(v_overall_score, v_avatar.current_day + 1);
        v_new_max_hp := fn_calculate_max_hp(v_new_level);

        UPDATE avatar_states SET
            health_points = v_new_hp,
            max_health_points = v_new_max_hp,
            streak_days = v_new_streak,
            max_streak_days = GREATEST(max_streak_days, v_new_streak),
            current_day = current_day + 1,
            current_level = v_new_level,
            total_days_completed = total_days_completed + CASE WHEN v_day_status = 'completed' THEN 1 ELSE 0 END,
            current_btc_multiplier = fn_calculate_btc_multiplier(v_new_level, v_new_streak, 0.00),
            version = version + 1
        WHERE user_id = p_user_id;
    END IF;

    -- 5. Crear daily_log con snapshots
    INSERT INTO daily_logs (
        user_id, day_number, day_status, completion_pct,
        tasks_completed, tasks_total, btc_earned,
        aura_snapshot, jawline_snapshot, wealth_snapshot,
        physique_snapshot, social_snapshot, env_snapshot,
        health_points, level_snapshot, completed_at
    )
    SELECT
        p_user_id, p_day_number, v_day_status, v_pct,
        v_completed_tasks, v_total_tasks, 0,
        a.aura_lvl, a.jawline_lvl, a.wealth_lvl,
        a.physique_lvl, a.social_lvl, a.env_lvl,
        a.health_points, a.current_level, NOW()
    FROM avatar_states a WHERE a.user_id = p_user_id;

    -- 6. Retornar resultado
    RETURN QUERY SELECT v_day_status, v_pct, v_hp_delta, v_new_hp, v_new_streak, v_death, v_btc_lost;
END;
$$ LANGUAGE plpgsql;
