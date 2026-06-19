-- 求人テーブル: 公開一覧・絞り込み・JOIN で多用するカラム
CREATE INDEX IF NOT EXISTS idx_jobs_published
  ON jobs (is_published, published_at DESC)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_jobs_company_id
  ON jobs (company_id);

CREATE INDEX IF NOT EXISTS idx_jobs_values_type
  ON jobs (values_type)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_jobs_employment_type
  ON jobs (employment_type)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_jobs_work_style
  ON jobs (work_style)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_jobs_region_id
  ON jobs (region_id);

-- 企業テーブル: ステータス絞り込み・一覧表示
CREATE INDEX IF NOT EXISTS idx_companies_status
  ON companies (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_companies_values_type
  ON companies (values_type)
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_companies_region_id
  ON companies (region_id);

-- 応募テーブル: 求職者・企業ダッシュボード
CREATE INDEX IF NOT EXISTS idx_applications_user_id
  ON applications (user_id, applied_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_job_id
  ON applications (job_id);

CREATE INDEX IF NOT EXISTS idx_applications_status
  ON applications (status);

-- マッチングスコア: 求職者の結果表示
CREATE INDEX IF NOT EXISTS idx_matching_scores_user_id
  ON matching_scores (user_id, score DESC);

CREATE INDEX IF NOT EXISTS idx_matching_scores_company_id
  ON matching_scores (company_id);

-- 診断結果: ユーザー・企業別取得
CREATE INDEX IF NOT EXISTS idx_user_diagnosis_results_user_id
  ON user_diagnosis_results (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_company_diagnosis_results_company_id
  ON company_diagnosis_results (company_id, created_at DESC);

-- 企業メンバー: 権限チェック（IDOR防止でも使用）
CREATE INDEX IF NOT EXISTS idx_company_members_user_id
  ON company_members (user_id);

CREATE INDEX IF NOT EXISTS idx_company_members_company_id
  ON company_members (company_id);

-- お気に入り: 求職者のお気に入り一覧
CREATE INDEX IF NOT EXISTS idx_favorites_user_id
  ON favorites (user_id, created_at DESC);

-- 診断回答: ユーザー・企業別集計
CREATE INDEX IF NOT EXISTS idx_user_diagnosis_answers_user_id
  ON user_diagnosis_answers (user_id);

CREATE INDEX IF NOT EXISTS idx_company_diagnosis_answers_company_id
  ON company_diagnosis_answers (company_id);
