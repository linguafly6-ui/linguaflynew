-- Apply to linguafly-learning (COURSE_DB), after 0001_student_accounts.sql.
CREATE TABLE IF NOT EXISTS learner_billing (
  learner_id TEXT PRIMARY KEY REFERENCES learner_accounts(learner_id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'incomplete',
  course_key TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_learner_billing_subscription ON learner_billing(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
