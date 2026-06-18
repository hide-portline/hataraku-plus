-- 単体テスト: calculate_matching_score の動作確認
-- 実行方法: Supabase SQL Editor または psql でこのファイルを実行してください。
-- トランザクション内で ROLLBACK するため、本番データを汚しません。

BEGIN;

-- テスト用の UUID（既存ユーザー・企業が無ければエラーになります）
-- 必要に応じて実在する user_id / company_id に書き換えてください
DO $$ BEGIN
  -- noop: プレースホルダブロック（互換性確保）
END $$;

-- クリーンアップ（同じテストIDがあれば上書きしないための削除）
DELETE FROM user_diagnosis_results WHERE id = '11111111-aaaa-0000-0000-000000000001'::uuid;
DELETE FROM company_diagnosis_results WHERE id = '22222222-bbbb-0000-0000-000000000001'::uuid;

-- テストデータ挿入（ユーザー側スコア）
INSERT INTO user_diagnosis_results (id, user_id, values_type, score_challenger, score_stable, score_team, score_specialist, created_at)
VALUES (
  '11111111-aaaa-0000-0000-000000000001'::uuid,
  'a0000001-0000-0000-0000-000000000000'::uuid,
  'challenger', 16, 8, 4, 2, now()
);

-- テストデータ挿入（企業側スコア）
INSERT INTO company_diagnosis_results (id, company_id, values_type, score_challenger, score_stable, score_team, score_specialist, created_at)
VALUES (
  '22222222-bbbb-0000-0000-000000000001'::uuid,
  'b0000001-0000-0000-0000-000000000000'::uuid,
  'challenger', 14, 10, 6, 4, now()
);

-- 関数呼び出し（期待する数値が返るかを確認）
SELECT calculate_matching_score(
  'a0000001-0000-0000-0000-000000000000'::uuid,
  'b0000001-0000-0000-0000-000000000000'::uuid
) AS matching_score;

ROLLBACK; -- テストデータを残さない
