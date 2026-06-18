CREATE TABLE diagnosis_questions (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question  text NOT NULL,
  category  text NOT NULL CHECK (category IN ('challenger','stable','team','specialist')),
  "order"   int NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  version   text NOT NULL DEFAULT 'v1'
);

CREATE TABLE diagnosis_options (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id  uuid NOT NULL REFERENCES diagnosis_questions(id) ON DELETE CASCADE,
  label        text NOT NULL,
  score        int NOT NULL CHECK (score BETWEEN 1 AND 4),
  "order"      int NOT NULL
);

-- 求職者診断
CREATE TABLE user_diagnosis_answers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id  uuid NOT NULL REFERENCES diagnosis_questions(id),
  option_id    uuid NOT NULL REFERENCES diagnosis_options(id),
  score        int NOT NULL,
  answered_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_diagnosis_results (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  values_type        text NOT NULL CHECK (values_type IN ('challenger','stable','team','specialist')),
  score_challenger   int NOT NULL DEFAULT 0,
  score_stable       int NOT NULL DEFAULT 0,
  score_team         int NOT NULL DEFAULT 0,
  score_specialist   int NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- 企業診断
CREATE TABLE company_diagnosis_answers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  question_id  uuid NOT NULL REFERENCES diagnosis_questions(id),
  option_id    uuid NOT NULL REFERENCES diagnosis_options(id),
  score        int NOT NULL,
  answered_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE company_diagnosis_results (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id         uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  values_type        text NOT NULL CHECK (values_type IN ('challenger','stable','team','specialist')),
  score_challenger   int NOT NULL DEFAULT 0,
  score_stable       int NOT NULL DEFAULT 0,
  score_team         int NOT NULL DEFAULT 0,
  score_specialist   int NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- マッチングスコア
CREATE TABLE matching_scores (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id     uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  score          int NOT NULL CHECK (score BETWEEN 0 AND 100),
  calculated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, company_id)
);

-- マッチングスコア算出関数
CREATE OR REPLACE FUNCTION calculate_matching_score(p_user_id uuid, p_company_id uuid)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  u_type text; c_type text;
  u_c int; u_s int; u_t int; u_sp int;
  c_c int; c_s int; c_t int; c_sp int;
  diff int;
BEGIN
  SELECT values_type, score_challenger, score_stable, score_team, score_specialist
  INTO u_type, u_c, u_s, u_t, u_sp
  FROM user_diagnosis_results WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT 1;

  SELECT values_type, score_challenger, score_stable, score_team, score_specialist
  INTO c_type, c_c, c_s, c_t, c_sp
  FROM company_diagnosis_results WHERE company_id = p_company_id ORDER BY created_at DESC LIMIT 1;

  IF u_type IS NULL OR c_type IS NULL THEN RETURN NULL; END IF;

  diff := ABS(u_c - c_c) + ABS(u_s - c_s) + ABS(u_t - c_t) + ABS(u_sp - c_sp);

  RETURN GREATEST(0, 100 - diff * 2);
END;
$$;
