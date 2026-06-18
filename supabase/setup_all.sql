-- ============================================================
-- HATARAKU+ セットアップSQL（全テーブル + シードデータ）
-- Supabase の SQL Editor にこれを全部貼り付けて実行してください
-- ============================================================

-- ── 001: regions ──────────────────────────────────────────────
CREATE TABLE regions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  is_active     boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── 002: users / companies / company_members ──────────────────
CREATE TABLE users (
  id                   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  email                text NOT NULL,
  phone                text,
  avatar_url           text,
  bio                  text,
  preferred_region_id  uuid REFERENCES regions(id),
  desired_location     text,
  employment_type_pref text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE companies (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id           uuid REFERENCES regions(id),
  company_name        text NOT NULL,
  industry            text,
  description         text,
  vision              text,
  culture_description text,
  logo_url            text,
  photo_urls          text[],
  employee_count      int,
  founded_year        int,
  location            text,
  website_url         text,
  contact_email       text NOT NULL,
  values_type         text CHECK (values_type IN ('challenger','stable','team','specialist')),
  status              text NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','approved','rejected')),
  rejection_reason    text,
  approved_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE company_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'owner' CHECK (role IN ('owner','editor')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);

-- ── 003: jobs / applications / favorites ──────────────────────
CREATE TABLE jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  region_id       uuid REFERENCES regions(id),
  title           text NOT NULL,
  employment_type text NOT NULL CHECK (employment_type IN ('fulltime','parttime','contract')),
  salary_min      int,
  salary_max      int,
  location        text,
  description     text,
  required_skills text,
  benefits        text,
  work_style      text CHECK (work_style IN ('remote','onsite','hybrid')),
  values_type     text CHECK (values_type IN ('challenger','stable','team','specialist')),
  is_published    boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  expires_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id      uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'applied'
              CHECK (status IN ('applied','screening','interview','offer','hired','rejected')),
  message     text,
  applied_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);

CREATE TABLE favorites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id      uuid REFERENCES jobs(id) ON DELETE CASCADE,
  company_id  uuid REFERENCES companies(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (job_id IS NOT NULL AND company_id IS NULL) OR
    (job_id IS NULL AND company_id IS NOT NULL)
  )
);

-- ── 004: 診断テーブル ──────────────────────────────────────────
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

CREATE TABLE matching_scores (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id     uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  score          int NOT NULL CHECK (score BETWEEN 0 AND 100),
  calculated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, company_id)
);

CREATE OR REPLACE FUNCTION calculate_matching_score(p_user_id uuid, p_company_id uuid)
RETURNS int LANGUAGE plpgsql AS $$
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

-- ── 005: articles / tags ──────────────────────────────────────
CREATE TABLE articles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid REFERENCES companies(id) ON DELETE SET NULL,
  author_user_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  region_id       uuid REFERENCES regions(id),
  title           text NOT NULL,
  content         text NOT NULL,
  thumbnail_url   text,
  article_type    text NOT NULL DEFAULT 'story'
                  CHECK (article_type IN ('story','interview','news')),
  is_published    boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tags (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name      text NOT NULL UNIQUE,
  category  text NOT NULL CHECK (category IN ('industry','value','workstyle'))
);

CREATE TABLE company_tags (
  company_id  uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tag_id      uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, tag_id)
);

CREATE TABLE job_tags (
  job_id   uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tag_id   uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, tag_id)
);

CREATE TABLE announcements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  content       text NOT NULL,
  target        text NOT NULL DEFAULT 'all' CHECK (target IN ('all','seeker','company')),
  is_published  boolean NOT NULL DEFAULT false,
  published_at  timestamptz
);

-- ── 006: email_logs ──────────────────────────────────────────
CREATE TABLE email_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email       text NOT NULL,
  template_name  text NOT NULL,
  subject        text NOT NULL,
  status         text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','failed')),
  metadata       jsonb,
  sent_at        timestamptz NOT NULL DEFAULT now()
);

-- ── 007: RLS ──────────────────────────────────────────────────
ALTER TABLE regions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies             ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites             ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_questions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_options     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_diagnosis_answers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_diagnosis_results  ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_diagnosis_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_diagnosis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_scores       ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tags              ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs            ENABLE ROW LEVEL SECURITY;

CREATE POLICY "regions_select" ON regions FOR SELECT USING (true);
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "companies_select_approved" ON companies FOR SELECT
  USING (status = 'approved' OR id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "companies_insert" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "companies_update_member" ON companies FOR UPDATE
  USING (id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

CREATE POLICY "cm_select" ON company_members FOR SELECT
  USING (user_id = auth.uid() OR company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "cm_insert" ON company_members FOR INSERT WITH CHECK (true);

CREATE POLICY "jobs_select_published" ON jobs FOR SELECT
  USING (is_published = true OR company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "jobs_insert_member" ON jobs FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "jobs_update_member" ON jobs FOR UPDATE
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "jobs_delete_member" ON jobs FOR DELETE
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

CREATE POLICY "app_select" ON applications FOR SELECT
  USING (user_id = auth.uid() OR
    job_id IN (SELECT j.id FROM jobs j JOIN company_members cm ON cm.company_id = j.company_id WHERE cm.user_id = auth.uid()));
CREATE POLICY "app_insert" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "app_update_status" ON applications FOR UPDATE
  USING (job_id IN (SELECT j.id FROM jobs j JOIN company_members cm ON cm.company_id = j.company_id WHERE cm.user_id = auth.uid()));

CREATE POLICY "fav_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fav_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fav_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "dq_select" ON diagnosis_questions FOR SELECT USING (true);
CREATE POLICY "do_select" ON diagnosis_options FOR SELECT USING (true);

CREATE POLICY "uda_select" ON user_diagnosis_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "uda_insert" ON user_diagnosis_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "udr_select" ON user_diagnosis_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "udr_insert" ON user_diagnosis_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "udr_update" ON user_diagnosis_results FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cda_select" ON company_diagnosis_answers FOR SELECT
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "cda_insert" ON company_diagnosis_answers FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "cdr_select" ON company_diagnosis_results FOR SELECT
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "cdr_insert" ON company_diagnosis_results FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "cdr_update" ON company_diagnosis_results FOR UPDATE
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

CREATE POLICY "ms_select" ON matching_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ms_upsert" ON matching_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "art_select" ON articles FOR SELECT
  USING (is_published = true OR company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "art_insert" ON articles FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "art_update" ON articles FOR UPDATE
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

CREATE POLICY "tags_select" ON tags FOR SELECT USING (true);
CREATE POLICY "ctags_select" ON company_tags FOR SELECT USING (true);
CREATE POLICY "jtags_select" ON job_tags FOR SELECT USING (true);
CREATE POLICY "ann_select" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "email_logs_deny" ON email_logs FOR SELECT USING (false);

-- ── SEED: regions ──────────────────────────────────────────────
INSERT INTO regions (name, slug, description, is_active, display_order) VALUES
  ('淡路島', 'awaji',     '兵庫県淡路島。自然豊かな島で、農業・観光・IT企業が集積。',     true,  1),
  ('徳島',   'tokushima', '徳島県。サテライトオフィス誘致が進む四国の玄関口。',             false, 2),
  ('高知',   'kochi',     '高知県。一次産業と移住支援が盛んな太平洋側の県。',               false, 3),
  ('伊豆市', 'izu',       '静岡県伊豆市。温泉と自然に囲まれた移住促進エリア。',             false, 4);

-- ── SEED: 診断質問20問 ────────────────────────────────────────
DO $$
DECLARE q uuid;
BEGIN

INSERT INTO diagnosis_questions (id, question, category, "order") VALUES
  ('11111111-0001-0000-0000-000000000000', '新しいプロジェクトやチャレンジに積極的に手を挙げる方だ', 'challenger', 1),
  ('11111111-0002-0000-0000-000000000000', '失敗を恐れず、まず行動することを大切にしている', 'challenger', 5),
  ('11111111-0003-0000-0000-000000000000', '変化の多い環境や不確実な状況にワクワクを感じる', 'challenger', 9),
  ('11111111-0004-0000-0000-000000000000', '高いリスクを取ってでも大きな成果を目指したい', 'challenger', 13),
  ('11111111-0005-0000-0000-000000000000', '現状維持より、常に改善や革新を求めて動く方だ', 'challenger', 17),
  ('22222222-0001-0000-0000-000000000000', '長期的に安定した環境で、着実にキャリアを積みたい', 'stable', 2),
  ('22222222-0002-0000-0000-000000000000', '明確な役割分担とルールがある職場の方が働きやすい', 'stable', 6),
  ('22222222-0003-0000-0000-000000000000', '仕事とプライベートのバランスを最も大切にしている', 'stable', 10),
  ('22222222-0004-0000-0000-000000000000', '予測可能なキャリアパスや評価制度がある会社を好む', 'stable', 14),
  ('22222222-0005-0000-0000-000000000000', 'リスクを最小化し、堅実に物事を進めることを重視する', 'stable', 18),
  ('33333333-0001-0000-0000-000000000000', 'チームで協力して目標を達成することに喜びを感じる', 'team', 3),
  ('33333333-0002-0000-0000-000000000000', '周りの人の感情や状況を理解することを大切にしている', 'team', 7),
  ('33333333-0003-0000-0000-000000000000', '職場の人間関係や雰囲気を最も重視して仕事を選ぶ', 'team', 11),
  ('33333333-0004-0000-0000-000000000000', '誰かの役に立っていると感じることが最大の動機になる', 'team', 15),
  ('33333333-0005-0000-0000-000000000000', '意見の対立があっても、うまく調整して合意を導ける', 'team', 19),
  ('44444444-0001-0000-0000-000000000000', '特定の分野で深い専門知識・スキルを磨き続けたい', 'specialist', 4),
  ('44444444-0002-0000-0000-000000000000', '自分の専門性が正当に評価される環境にこだわる', 'specialist', 8),
  ('44444444-0003-0000-0000-000000000000', '仕事のクオリティに強いこだわりを持ち、妥協しない', 'specialist', 12),
  ('44444444-0004-0000-0000-000000000000', '継続的な学習と自己成長が仕事の一部だと考えている', 'specialist', 16),
  ('44444444-0005-0000-0000-000000000000', '細部まで丁寧に分析・検証することが得意で好きだ', 'specialist', 20);

-- 全質問に同じ選択肢（A=4, B=3, C=2, D=1）を挿入
FOR q IN SELECT id FROM diagnosis_questions LOOP
  INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
    (q, 'A. とても当てはまる',    4, 1),
    (q, 'B. やや当てはまる',      3, 2),
    (q, 'C. あまり当てはまらない', 2, 3),
    (q, 'D. 全く当てはまらない',  1, 4);
END LOOP;

END $$;
