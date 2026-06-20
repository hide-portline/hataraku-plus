-- シードデータの salary_min/salary_max が万円単位（220等）で入力されていた。
-- フォームは円単位（200000等）で保存するため、既存レコードを ×10000 で修正する。
-- 修正対象: 値が 10000 未満のレコード（万円単位で入力されたもの）
UPDATE jobs
SET
  salary_min = salary_min * 10000,
  salary_max = salary_max * 10000
WHERE
  salary_min IS NOT NULL
  AND salary_min < 10000;
