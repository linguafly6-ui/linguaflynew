-- AI-generated exercise drafts. Correct answers remain in D1 and are never sent to learners.
CREATE TABLE IF NOT EXISTS unit_generated_exercise_drafts (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  level TEXT NOT NULL CHECK(level IN ('A1','A2','B1','B2','C1','C2')),
  model TEXT NOT NULL,
  content_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'review' CHECK(status IN ('review','approved','rejected')),
  generated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  UNIQUE(course_id, unit_id)
);
CREATE INDEX IF NOT EXISTS idx_generated_exercises_course_status
  ON unit_generated_exercise_drafts(course_id, status, generated_at DESC);
