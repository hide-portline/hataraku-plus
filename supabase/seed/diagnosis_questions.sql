-- 診断質問 20問（各タイプ5問）と選択肢
-- 選択肢スコア: A=4, B=3, C=2, D=1

DO $$
DECLARE
  q uuid;
BEGIN

-- ──────── Challenger（挑戦型）5問 ────────

INSERT INTO diagnosis_questions (id, question, category, "order") VALUES
  ('11111111-0001-0000-0000-000000000000', '新しいプロジェクトやチャレンジに積極的に手を挙げる方だ', 'challenger', 1),
  ('11111111-0002-0000-0000-000000000000', '失敗を恐れず、まず行動することを大切にしている', 'challenger', 5),
  ('11111111-0003-0000-0000-000000000000', '変化の多い環境や不確実な状況にワクワクを感じる', 'challenger', 9),
  ('11111111-0004-0000-0000-000000000000', '高いリスクを取ってでも大きな成果を目指したい', 'challenger', 13),
  ('11111111-0005-0000-0000-000000000000', '現状維持より、常に改善や革新を求めて動く方だ', 'challenger', 17);

-- Challenger 選択肢
SELECT id INTO q FROM diagnosis_questions WHERE "order" = 1;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 5;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 9;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 13;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 17;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

-- ──────── Stable（安定型）5問 ────────

INSERT INTO diagnosis_questions (id, question, category, "order") VALUES
  ('22222222-0001-0000-0000-000000000000', '長期的に安定した環境で、着実にキャリアを積みたい', 'stable', 2),
  ('22222222-0002-0000-0000-000000000000', '明確な役割分担とルールがある職場の方が働きやすい', 'stable', 6),
  ('22222222-0003-0000-0000-000000000000', '仕事とプライベートのバランスを最も大切にしている', 'stable', 10),
  ('22222222-0004-0000-0000-000000000000', '予測可能なキャリアパスや評価制度がある会社を好む', 'stable', 14),
  ('22222222-0005-0000-0000-000000000000', 'リスクを最小化し、堅実に物事を進めることを重視する', 'stable', 18);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 2;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 6;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 10;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 14;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 18;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

-- ──────── Team（協調型）5問 ────────

INSERT INTO diagnosis_questions (id, question, category, "order") VALUES
  ('33333333-0001-0000-0000-000000000000', 'チームで協力して目標を達成することに喜びを感じる', 'team', 3),
  ('33333333-0002-0000-0000-000000000000', '周りの人の感情や状況を理解することを大切にしている', 'team', 7),
  ('33333333-0003-0000-0000-000000000000', '職場の人間関係や雰囲気を最も重視して仕事を選ぶ', 'team', 11),
  ('33333333-0004-0000-0000-000000000000', '誰かの役に立っていると感じることが最大の動機になる', 'team', 15),
  ('33333333-0005-0000-0000-000000000000', '意見の対立があっても、うまく調整して合意を導ける', 'team', 19);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 3;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 7;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 11;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 15;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 19;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

-- ──────── Specialist（専門型）5問 ────────

INSERT INTO diagnosis_questions (id, question, category, "order") VALUES
  ('44444444-0001-0000-0000-000000000000', '特定の分野で深い専門知識・スキルを磨き続けたい', 'specialist', 4),
  ('44444444-0002-0000-0000-000000000000', '自分の専門性が正当に評価される環境にこだわる', 'specialist', 8),
  ('44444444-0003-0000-0000-000000000000', '仕事のクオリティに強いこだわりを持ち、妥協しない', 'specialist', 12),
  ('44444444-0004-0000-0000-000000000000', '継続的な学習と自己成長が仕事の一部だと考えている', 'specialist', 16),
  ('44444444-0005-0000-0000-000000000000', '細部まで丁寧に分析・検証することが得意で好きだ', 'specialist', 20);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 4;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 8;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 12;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 16;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

SELECT id INTO q FROM diagnosis_questions WHERE "order" = 20;
INSERT INTO diagnosis_options (question_id, label, score, "order") VALUES
  (q, 'A. とても当てはまる', 4, 1), (q, 'B. やや当てはまる', 3, 2),
  (q, 'C. あまり当てはまらない', 2, 3), (q, 'D. 全く当てはまらない', 1, 4);

END $$;
