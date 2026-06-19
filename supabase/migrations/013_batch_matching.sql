-- 全企業のマッチングスコアを一括計算する関数（N+1問題対策）
-- N回のRPC呼び出しを1回に削減
CREATE OR REPLACE FUNCTION calculate_all_matching_scores(p_user_id uuid)
RETURNS TABLE (company_id uuid, score int)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  u_c  int;
  u_s  int;
  u_t  int;
  u_sp int;
  u_type text;
BEGIN
  SELECT values_type, score_challenger, score_stable, score_team, score_specialist
  INTO u_type, u_c, u_s, u_t, u_sp
  FROM user_diagnosis_results
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF u_type IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    cdr.company_id,
    GREATEST(0, 100 - (
      ABS(u_c  - cdr.score_challenger) +
      ABS(u_s  - cdr.score_stable)     +
      ABS(u_t  - cdr.score_team)       +
      ABS(u_sp - cdr.score_specialist)
    ) * 2)::int AS score
  FROM (
    SELECT DISTINCT ON (company_id)
      company_id, score_challenger, score_stable, score_team, score_specialist
    FROM company_diagnosis_results
    ORDER BY company_id, created_at DESC
  ) cdr;
END;
$$;
