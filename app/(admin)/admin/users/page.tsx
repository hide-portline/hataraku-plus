import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: results } = await supabase
    .from("user_diagnosis_results")
    .select("user_id, values_type");

  const typeMap = Object.fromEntries(results?.map((r) => [r.user_id, r.values_type]) ?? []);

  const TYPE_LABELS: Record<string, string> = {
    challenger: "チャレンジャー",
    stable: "スタビル",
    team: "チーム",
    specialist: "スペシャリスト",
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">ユーザー管理</h1>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">氏名</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">メールアドレス</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">価値観タイプ</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">登録日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--color-surface)]">
                <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{u.name}</td>
                <td className="px-5 py-4 text-[var(--color-text-secondary)]">{u.email}</td>
                <td className="px-5 py-4">
                  {typeMap[u.id] ? (
                    <span className="text-xs bg-[var(--color-brand)]/10 text-[var(--color-brand)] px-2.5 py-0.5 rounded-full font-semibold">
                      {TYPE_LABELS[typeMap[u.id]] ?? typeMap[u.id]}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">未診断</span>
                  )}
                </td>
                <td className="px-5 py-4 text-[var(--color-text-muted)]">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <p className="text-center py-12 text-[var(--color-text-muted)]">ユーザーがいません</p>
        )}
      </div>
    </div>
  );
}
