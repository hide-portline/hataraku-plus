CREATE TABLE email_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email       text NOT NULL,
  template_name  text NOT NULL,
  subject        text NOT NULL,
  status         text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','failed')),
  metadata       jsonb,
  sent_at        timestamptz NOT NULL DEFAULT now()
);
