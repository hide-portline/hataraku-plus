-- C-1 修正: companies/company_members の INSERT RLS を強化
-- register_company SECURITY DEFINER 関数経由のみ挿入を許可する
-- （SECURITY DEFINER 関数は RLS をバイパスするため、この制限は関数の動作に影響しない）

DROP POLICY IF EXISTS "companies_insert"  ON companies;
DROP POLICY IF EXISTS "cm_insert"         ON company_members;

-- 直接 INSERT を完全禁止（SECURITY DEFINER 関数からの挿入は引き続き可能）
CREATE POLICY "companies_insert" ON companies
  FOR INSERT WITH CHECK (false);

CREATE POLICY "cm_insert" ON company_members
  FOR INSERT WITH CHECK (false);
