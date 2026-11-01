-- Proposed additive migration for curriculum source reconciliation.
-- Target: COURSE_DB (linguafly-learning).
-- IMPORTANT:
--   * This file is intentionally NOT applied by this change.
--   * wrangler.jsonc currently does not configure migrations_dir for COURSE_DB.
--   * The existing academic schema has no checked-in baseline migration.
--   * Reconcile the live schema and prepare preview before enabling this migration.
-- This migration records provenance and import outcomes; it does not move or delete
-- curriculum content and it must never store learner-facing answer keys in public data.

CREATE TABLE IF NOT EXISTS curriculum_import_runs (
  id TEXT PRIMARY KEY,
  source_snapshot TEXT NOT NULL,
  manifest_hash TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('dry_run', 'apply')),
  status TEXT NOT NULL DEFAULT 'started'
    CHECK (status IN ('started', 'completed', 'completed_with_conflicts', 'failed')),
  report_json TEXT NOT NULL DEFAULT '{}',
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_curriculum_import_runs_status
  ON curriculum_import_runs(status, started_at DESC);

CREATE TABLE IF NOT EXISTS curriculum_source_records (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES curriculum_import_runs(id) ON DELETE RESTRICT,
  source_system TEXT NOT NULL,
  source_key TEXT NOT NULL,
  source_path TEXT,
  source_hash TEXT NOT NULL,
  entity_type TEXT NOT NULL
    CHECK (entity_type IN (
      'course', 'unit', 'section', 'exercise',
      'option', 'answer_key', 'media', 'blueprint'
    )),
  target_entity_id TEXT,
  status TEXT NOT NULL DEFAULT 'discovered'
    CHECK (status IN (
      'discovered', 'validated', 'imported',
      'conflict', 'skipped', 'review'
    )),
  source_metadata_json TEXT NOT NULL DEFAULT '{}',
  conflict_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  imported_at TEXT,
  UNIQUE (source_system, source_key, source_hash, entity_type)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_source_records_run_status
  ON curriculum_source_records(run_id, status);

CREATE INDEX IF NOT EXISTS idx_curriculum_source_records_target
  ON curriculum_source_records(entity_type, target_entity_id);

CREATE INDEX IF NOT EXISTS idx_curriculum_source_records_source
  ON curriculum_source_records(source_system, source_key);
