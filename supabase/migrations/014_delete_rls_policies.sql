-- 欠落していた DELETE RLS ポリシーを追加

-- 求人: 企業メンバーが削除可能
CREATE POLICY "jobs_delete_member" ON jobs FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM company_members WHERE user_id = auth.uid()
  ));

-- 応募: 企業メンバーが削除可能（応募取り消しはユーザー側では不可にする設計）
CREATE POLICY "app_delete_company" ON applications FOR DELETE
  USING (job_id IN (
    SELECT j.id FROM jobs j
    JOIN company_members cm ON cm.company_id = j.company_id
    WHERE cm.user_id = auth.uid()
  ));

-- 記事: 企業メンバーが削除可能
CREATE POLICY "art_delete" ON articles FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM company_members WHERE user_id = auth.uid()
  ));

-- 企業診断回答: 企業メンバーが削除可能（再診断時）
CREATE POLICY "cda_delete" ON company_diagnosis_answers FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM company_members WHERE user_id = auth.uid()
  ));

-- 企業診断結果: 企業メンバーが削除可能
CREATE POLICY "cdr_delete" ON company_diagnosis_results FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM company_members WHERE user_id = auth.uid()
  ));

-- マッチングスコア: 本人が削除可能（退会時のカスケード用）
CREATE POLICY "ms_delete" ON matching_scores FOR DELETE
  USING (auth.uid() = user_id);

-- お気に入り削除は既存 (fav_delete) あり、スキップ
-- user_diagnosis_answers 削除は既存 (uda_delete) あり、スキップ
-- user_diagnosis_results 削除は既存 (udr_delete) あり、スキップ
