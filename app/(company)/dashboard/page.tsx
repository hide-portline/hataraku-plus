import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Button from "@/components/ui/Button";
import { formatApplicationStatus } from "@/lib/utils/format";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id, companies(*)")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return (
      <div className="p-8 text-center text-[var(--color-text-secondary)]">
        <p>企業情報が見つかりません。</p>
      </div>
    );
  }

  const companyId = membership.company_id;
  const company = Array.isArray(membership.companies) ? membership.companies[0] : membership.companies;

  const [{ count: jobCount }, { count: appCount }, { data: recentApps }] = await Promise.all([
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("is_published", true),
    supabase.from("applications").select("*", { count: "exact", head: true })
      .in("job_id", (await supabase.from("jobs").select("id").eq("company_id", companyId)).data?.map(j => j.id) ?? []),
    supabase.from("applications")
      .select("*, jobs(title), users(name, email)")
      .in("job_id", (await supabase.from("jobs").select("id").eq("company_id", companyId)).data?.map(j => j.id) ?? [])
      .order("applied_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{company?.company_name}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">企業ダッシュボード</p>
        </div>
        {company?.status === "pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
            ⏳ 現在、管理者が企業情報を確認中です。承認後に求人が公開されます。
          </div>
        )}
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "公開中の求人", value: jobCount ?? 0 },
          { label: "累計応募数", value: appCount ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
            <p className="text-3xl font-bold text-[var(--color-brand)]">{stat.value}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
          <Link href="/company/jobs/new">
            <Button variant="secondary" size="sm" className="w-full">+ 求人を追加</Button>
          </Link>
        </div>
      </div>

      {/* 最近の応募 */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center">
          <h2 className="font-bold text-[var(--color-text-primary)]">最近の応募</h2>
          <Link href="/company/applications" className="text-sm text-[var(--color-brand)] hover:underline">すべて見る</Link>
        </div>
        {!recentApps || recentApps.length === 0 ? (
          <p className="text-center py-10 text-sm text-[var(--color-text-muted)]">まだ応募はありません</p>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {recentApps.map((app) => {
              const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
              const seeker = Array.isArray(app.users) ? app.users[0] : app.users;
              return (
                <div key={app.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text-primary)]">{seeker?.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{job?.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(app.applied_at).toLocaleDateString("ja-JP")}
                    </span>
                    <span className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                      {formatApplicationStatus(app.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
