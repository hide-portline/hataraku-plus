import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// サービスロールを使う管理者クライアント（RLS をバイパス）
// Server Action 内でのみ使用すること
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY が設定されていません");
  }
  return createClient<Database>(url, key);
}
