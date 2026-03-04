-- ============================================================
-- FYT FYN FYN — Supabase Schema (multi-user, flexible splits)
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── EXERCISES ───────────────────────────────────────────────
-- category is free-text to support PPL, Bro Split, Upper/Lower, etc.
CREATE TABLE exercises (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT NOT NULL DEFAULT 'user1',
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;

-- ─── WORKOUT SESSIONS ─────────────────────────────────────────
CREATE TABLE workout_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT NOT NULL DEFAULT 'user1',
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE workout_sessions DISABLE ROW LEVEL SECURITY;

-- ─── WORKOUT SETS ─────────────────────────────────────────────
CREATE TABLE workout_sets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           TEXT NOT NULL DEFAULT 'user1',
  exercise_id       UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  session_id        UUID REFERENCES workout_sessions(id) ON DELETE SET NULL,
  set_number        INTEGER NOT NULL DEFAULT 1,
  weight_kg         NUMERIC(6,2) NOT NULL DEFAULT 0,
  reps              INTEGER NOT NULL DEFAULT 0,
  target_weight_kg  NUMERIC(6,2),
  target_reps       INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX sets_exercise_idx ON workout_sets(exercise_id);
CREATE INDEX sets_session_idx ON workout_sets(session_id);
CREATE INDEX sets_user_idx ON workout_sets(user_id);

ALTER TABLE workout_sets DISABLE ROW LEVEL SECURITY;

-- ─── CARDIO SESSIONS ──────────────────────────────────────────
CREATE TABLE cardio_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           TEXT NOT NULL DEFAULT 'user1',
  date              DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes  INTEGER NOT NULL,
  calories          INTEGER,
  notes             TEXT,
  type              TEXT DEFAULT 'Run',
  distance_km       NUMERIC(5,2),
  incline_level     NUMERIC(4,1),
  speed_level       NUMERIC(4,1),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cardio_sessions DISABLE ROW LEVEL SECURITY;

-- ─── BODY WEIGHT LOGS ─────────────────────────────────────────
CREATE TABLE body_weight_logs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          TEXT NOT NULL DEFAULT 'user1',
  date             DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg        NUMERIC(5,1) NOT NULL,
  body_fat_percent NUMERIC(4,1),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE body_weight_logs DISABLE ROW LEVEL SECURITY;

-- ─── CHEAT DAYS ──────────────────────────────────────────────
CREATE TABLE cheat_days (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT NOT NULL,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  selections  TEXT[] NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_cheat_days_user_date ON cheat_days(user_id, date);

ALTER TABLE cheat_days DISABLE ROW LEVEL SECURITY;

-- ─── MIGRATION (run on existing DB) ──────────────────────────
-- Run these if upgrading from previous schema:

-- ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_category_check;
-- ALTER TABLE exercises ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'user1';
-- ALTER TABLE workout_sessions ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'user1';
-- ALTER TABLE workout_sets ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'user1';
-- ALTER TABLE cardio_sessions ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'user1';
-- ALTER TABLE body_weight_logs ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'user1';
-- ALTER TABLE body_weight_logs ADD COLUMN IF NOT EXISTS body_fat_percent NUMERIC(4,1);
-- CREATE INDEX IF NOT EXISTS sets_user_idx ON workout_sets(user_id);

-- ─── CARDIO TYPE & DISTANCE MIGRATION ────────────────────────
-- Run these if upgrading an existing cardio_sessions table:
-- ALTER TABLE cardio_sessions ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Run';
-- ALTER TABLE cardio_sessions ADD COLUMN IF NOT EXISTS distance_km NUMERIC(5,2);

-- ─── CARDIO INCLINE & SPEED MIGRATION ────────────────────────
-- Run these to add treadmill-style tracking for Run & Walk:
-- ALTER TABLE cardio_sessions ADD COLUMN IF NOT EXISTS incline_level NUMERIC(4,1);
-- ALTER TABLE cardio_sessions ADD COLUMN IF NOT EXISTS speed_level NUMERIC(4,1);

-- ─── USER PROFILES ───────────────────────────────────────────
CREATE TABLE user_profiles (
  user_id     TEXT PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT '',
  split       TEXT,
  custom_days JSONB NOT NULL DEFAULT '[]',
  day_split   JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- ─── USER PROFILES MIGRATION (run on existing DB) ────────────
-- CREATE TABLE IF NOT EXISTS user_profiles (
--   user_id     TEXT PRIMARY KEY,
--   name        TEXT NOT NULL DEFAULT '',
--   split       TEXT,
--   custom_days JSONB NOT NULL DEFAULT '[]',
--   day_split   JSONB NOT NULL DEFAULT '{}',
--   created_at  TIMESTAMPTZ DEFAULT NOW(),
--   updated_at  TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- ─── CHEAT DAYS MIGRATION ────────────────────────────────────
-- Run this if the cheat_days table doesn't exist yet:
-- CREATE TABLE IF NOT EXISTS cheat_days (
--   id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   user_id     TEXT NOT NULL,
--   date        DATE NOT NULL DEFAULT CURRENT_DATE,
--   selections  TEXT[] NOT NULL,
--   created_at  TIMESTAMPTZ DEFAULT NOW(),
--   UNIQUE(user_id, date)
-- );
-- CREATE INDEX IF NOT EXISTS idx_cheat_days_user_date ON cheat_days(user_id, date);
-- ALTER TABLE cheat_days DISABLE ROW LEVEL SECURITY;
