-- ============================================================
-- Migration 010: 診断機能のバグ修正
-- 問題1: user_diagnosis_results に UNIQUE(user_id) がないため
--         upsert(onConflict:"user_id") が PostgreSQL エラーを起こす
-- 問題2: DELETE/UPDATE RLS ポリシーが不足 → 再診断が壊れる
-- 問題3: 求職者が company_diagnosis_results を読めない → マッチ度が計算されない
-- ============================================================

-- ① 重複行を削除してから UNIQUE 制約を追加（一番古い行を残す）
DELETE FROM user_diagnosis_results a
USING user_diagnosis_results b
WHERE a.user_id = b.user_id AND a.created_at < b.created_at;

ALTER TABLE user_diagnosis_results
  ADD CONSTRAINT udr_user_unique UNIQUE (user_id);

-- ② user_diagnosis_answers も重複削除 + UNIQUE 制約
DELETE FROM user_diagnosis_answers a
USING user_diagnosis_answers b
WHERE a.user_id = b.user_id
  AND a.question_id = b.question_id
  AND a.answered_at < b.answered_at;

ALTER TABLE user_diagnosis_answers
  ADD CONSTRAINT uda_user_question_unique UNIQUE (user_id, question_id);

-- ③ 不足している RLS DELETE ポリシーを追加
CREATE POLICY "uda_delete" ON user_diagnosis_answers
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "udr_delete" ON user_diagnosis_results
  FOR DELETE USING (auth.uid() = user_id);

-- ④ matching_scores の UPDATE ポリシー追加（upsert の UPDATE 時に必要）
CREATE POLICY "ms_update" ON matching_scores
  FOR UPDATE USING (auth.uid() = user_id);

-- ⑤ 求職者が企業診断結果を読めるようにする（マッチ度計算に必要）
--    既存の会社メンバー専用ポリシーを廃止し、認証済み全員が読めるポリシーに変更
DROP POLICY IF EXISTS "cdr_select" ON company_diagnosis_results;
CREATE POLICY "cdr_select" ON company_diagnosis_results
  FOR SELECT USING (auth.uid() IS NOT NULL);
