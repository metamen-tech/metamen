-- ============================================================
-- METAMEN100 — Migración 002: Funciones Utilitarias
-- ============================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Secuencia para nicknames METAMEN-XXXX
CREATE SEQUENCE IF NOT EXISTS nickname_seq START WITH 1 INCREMENT BY 1;

-- Generador de nicknames únicos
CREATE OR REPLACE FUNCTION fn_generate_nickname()
RETURNS TEXT AS $$
DECLARE
    v_seq INTEGER;
BEGIN
    v_seq := nextval('nickname_seq');
    RETURN 'METAMEN-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
