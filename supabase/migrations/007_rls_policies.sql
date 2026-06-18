-- RLS 有効化
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

-- regions: 全員読み取り可、書き込みは admin のみ
CREATE POLICY "regions_select" ON regions FOR SELECT USING (true);

-- users: 本人のみ
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- companies: approved は全員閲覧、それ以外は company_members 本人
CREATE POLICY "companies_select_approved" ON companies FOR SELECT
  USING (status = 'approved' OR
    id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

CREATE POLICY "companies_insert" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "companies_update_member" ON companies FOR UPDATE
  USING (id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

-- company_members
CREATE POLICY "cm_select" ON company_members FOR SELECT
  USING (user_id = auth.uid() OR
    company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "cm_insert" ON company_members FOR INSERT WITH CHECK (true);

-- jobs: published は全員閲覧
CREATE POLICY "jobs_select_published" ON jobs FOR SELECT
  USING (is_published = true OR
    company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "jobs_insert_member" ON jobs FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "jobs_update_member" ON jobs FOR UPDATE
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

-- applications: 本人 + 該当企業
CREATE POLICY "app_select" ON applications FOR SELECT
  USING (user_id = auth.uid() OR
    job_id IN (SELECT j.id FROM jobs j
      JOIN company_members cm ON cm.company_id = j.company_id
      WHERE cm.user_id = auth.uid()));
CREATE POLICY "app_insert" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "app_update_status" ON applications FOR UPDATE
  USING (job_id IN (SELECT j.id FROM jobs j
    JOIN company_members cm ON cm.company_id = j.company_id
    WHERE cm.user_id = auth.uid()));

-- favorites: 本人のみ
CREATE POLICY "fav_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fav_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fav_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- diagnosis: 全員読み取り（質問・選択肢）
CREATE POLICY "dq_select" ON diagnosis_questions FOR SELECT USING (true);
CREATE POLICY "do_select" ON diagnosis_options FOR SELECT USING (true);

-- 求職者診断回答・結果: 本人のみ
CREATE POLICY "uda_select" ON user_diagnosis_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "uda_insert" ON user_diagnosis_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "udr_select" ON user_diagnosis_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "udr_insert" ON user_diagnosis_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "udr_update" ON user_diagnosis_results FOR UPDATE USING (auth.uid() = user_id);

-- 企業診断: company_members のみ
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

-- matching_scores: 本人のみ
CREATE POLICY "ms_select" ON matching_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ms_upsert" ON matching_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- articles: published は全員閲覧
CREATE POLICY "art_select" ON articles FOR SELECT
  USING (is_published = true OR
    company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "art_insert" ON articles FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "art_update" ON articles FOR UPDATE
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

-- tags: 全員閲覧
CREATE POLICY "tags_select" ON tags FOR SELECT USING (true);
CREATE POLICY "ctags_select" ON company_tags FOR SELECT USING (true);
CREATE POLICY "jtags_select" ON job_tags FOR SELECT USING (true);

-- announcements: published は全員閲覧
CREATE POLICY "ann_select" ON announcements FOR SELECT USING (is_published = true);

-- email_logs: サーバーサイドのみ（anon からは不可）
CREATE POLICY "email_logs_deny" ON email_logs FOR SELECT USING (false);
