import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    { count: pendingCompanies },
    { count: totalCompanies },
    { count: totalJobs },
    { count: totalUsers },
  ] = await Promise.all([
    supabase.from("companies").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "審査待ち企業", value: pendingCompanies ?? 0, href: "/admin/companies", urgent: (pendingCompanies ?? 0) > 0 },
    { label: "登録企業数", value: totalCompanies ?? 0, href: "/admin/companies" },
    { label: "求人数", value: totalJobs ?? 0, href: "/admin/jobs" },
    { label: "登録ユーザー数", value: totalUsers ?? 0, href: "/admin/users" },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-6">管理ダッシュボード</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow
              ${s.urgent ? "border-amber-300 bg-amber-50" : "border-[var(--color-border)]"}`}>
              <p className={`text-3xl font-bold ${s.urgent ? "text-amber-600" : "text-[var(--color-brand)]"}`}>
                {s.value}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{s.label}</p>
              {s.urgent && <p className="text-xs text-amber-600 mt-1 font-semibold">要対応</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
