import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatApplicationStatus, formatDate } from "@/lib/utils/format";

const STATUS_COLORS: Record<string, string> = {
  applied:   "bg-blue-100 text-blue-700",
  screening: "bg-yellow-100 text-yellow-700",
  interview: "bg-purple-100 text-purple-700",
  offer:     "bg-green-100 text-green-700",
  hired:     "bg-green-200 text-green-800",
  rejected:  "bg-red-100 text-red-600",
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: apps } = await supabase
    .from("applications")
    .select("*, jobs(title, companies(company_name, logo_url))")
    .eq("user_id", user.id)
    .order("applied_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/mypage" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">← マイページ</Link>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">応募履歴</h1>
        </div>

        {!apps || apps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm text-center py-16">
            <p className="text-4xl mb-4">📋</p>
            <p className="font-semibold text-[var(--color-text-primary)] mb-1">まだ応募していません</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">気になる求人に応募してみましょう</p>
            <Link href="/jobs" className="inline-block px-6 py-2.5 rounded-full bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-colors">
              求人を探す
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {apps.map((app) => {
              const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
              const company = job
                ? (Array.isArray(job.companies) ? job.companies[0] : job.companies)
                : null;
              const colorClass = STATUS_COLORS[app.status] ?? "bg-gray-100 text-gray-600";
              return (
                <div key={app.id} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--color-text-muted)] mb-1">{company?.company_name ?? "-"}</p>
                      <p className="font-semibold text-[var(--color-text-primary)] leading-tight">{job?.title ?? "-"}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1.5">応募日: {formatDate(app.applied_at)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${colorClass}`}>
                      {formatApplicationStatus(app.status)}
                    </span>
                  </div>
                  {app.message && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-3 bg-[var(--color-surface)] rounded-lg px-3 py-2 border border-[var(--color-border)] line-clamp-2">
                      {app.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
