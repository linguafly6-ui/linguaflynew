CREATE TABLE IF NOT EXISTS learner_activity_attempts (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  course_key TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  interaction_id TEXT NOT NULL,
  mastery_tag TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK(is_correct IN (0,1)),
  attempted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_attempts_learner_skill_date
  ON learner_activity_attempts(learner_id, mastery_tag, attempted_at DESC);
CREATE TABLE IF NOT EXISTS learner_skill_reviews (
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  course_key TEXT NOT NULL,
  mastery_tag TEXT NOT NULL,
  failure_count INTEGER NOT NULL DEFAULT 0,
  success_streak INTEGER NOT NULL DEFAULT 0,
  interval_hours INTEGER NOT NULL DEFAULT 24,
  due_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_attempt_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(learner_id, course_key, mastery_tag)
);
CREATE INDEX IF NOT EXISTS idx_skill_reviews_due
  ON learner_skill_reviews(learner_id, due_at);
