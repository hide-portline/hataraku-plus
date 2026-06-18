import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatApplicationStatus, formatDate } from "@/lib/utils/format";
import type { ApplicationStatus } from "@/types/database";

async function updateStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const status = formData.get("status") as ApplicationStatus;
  const supabase = await createClient();
  await supabase.from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  redirect("/company/applications");
}

const STATUS_COLORS: Record<string, string> = {
  applied:   "bg-blue-100 text-blue-700",
  screening: "bg-yellow-100 text-yellow-700",
  interview: "bg-purple-100 text-purple-700",
  offer:     "bg-green-100 text-green-700",
  hired:     "bg-green-200 text-green-800",
  rejected:  "bg-red-100 text-red-600",
};

export default async function CompanyApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  if (!membership) redirect("/dashboard");

  const companyId = membership.company_id;
  const jobIds = (await supabase.from("jobs").select("id").eq("company_id", companyId)).data?.map(j => j.id) ?? [];

  const { data: apps } = await supabase
    .from("applications")
    .select("*, jobs(title), users(name, email)")
    .in("job_id", jobIds.length > 0 ? jobIds : [""])
    .order("applied_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">応募管理</h1>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        {!apps || apps.length === 0 ? (
          <p className="text-center py-16 text-[var(--color-text-muted)]">まだ応募はありません</p>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {apps.map((app) => {
              const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
              const seeker = Array.isArray(app.users) ? app.users[0] : app.users;
              const colorClass = STATUS_COLORS[app.status] ?? "bg-gray-100 text-gray-600";
              return (
                <div key={app.id} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${colorClass}`}>
                          {formatApplicationStatus(app.status)}
                        </span>
                        <p className="text-xs text-[var(--color-text-muted)]">{formatDate(app.applied_at)}</p>
                      </div>
                      <p className="font-semibold text-[var(--color-text-primary)]">{seeker?.name ?? "不明"}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{seeker?.email}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">求人: {job?.title}</p>
                      {app.message && (
                        <p className="text-sm text-[var(--color-text-secondary)] mt-2 bg-[var(--color-surface)] rounded-lg px-3 py-2 border border-[var(--color-border)]">
                          {app.message}
                        </p>
                      )}
                    </div>

                    <form action={updateStatus} className="shrink-0 flex items-center gap-2">
                      <input type="hidden" name="id" value={app.id} />
                      <select
                        name="status"
                        defaultValue={app.status}
                        className="text-xs border border-[var(--color-border)] rounded-lg px-2 py-1.5 bg-white outline-none focus:border-[var(--color-brand)]"
                      >
                        <option value="applied">応募済み</option>
                        <option value="screening">書類選考中</option>
                        <option value="interview">面接中</option>
                        <option value="offer">内定</option>
                        <option value="hired">採用</option>
                        <option value="rejected">不採用</option>
                      </select>
                      <button className="text-xs bg-[var(--color-brand)] text-white px-3 py-1.5 rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors">
                        更新
                      </button>
                    </form>
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
