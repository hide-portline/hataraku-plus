import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending:  { label: "審査待ち", class: "bg-amber-100 text-amber-700" },
  approved: { label: "承認済み", class: "bg-green-100 text-green-700" },
  rejected: { label: "非承認",   class: "bg-red-100 text-red-700" },
};

export default async function AdminCompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("*, regions(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">企業管理</h1>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">企業名</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">地域</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">業種</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">ステータス</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">登録日</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {companies?.map((c) => {
              const s = STATUS_LABELS[c.status] ?? STATUS_LABELS.pending;
              const region = Array.isArray(c.regions) ? c.regions[0] : c.regions;
              return (
                <tr key={c.id} className="hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{c.company_name}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{region?.name ?? "-"}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{c.industry ?? "-"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.class}`}>{s.label}</span>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-text-muted)]">
                    {new Date(c.created_at).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/companies/${c.id}`} className="text-[var(--color-brand)] hover:underline font-semibold">
                      詳細
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!companies || companies.length === 0) && (
          <p className="text-center py-12 text-[var(--color-text-muted)]">企業がありません</p>
        )}
      </div>
    </div>
  );
}
