import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatEmploymentType, formatSalary } from "@/lib/utils/format";

async function togglePublish(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";
  const supabase = await createClient();
  await supabase.from("jobs").update({
    is_published: !current,
    published_at: !current ? new Date().toISOString() : null,
  }).eq("id", id);
  redirect("/admin/jobs");
}

export default async function AdminJobsPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, companies(company_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">求人管理</h1>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">タイトル</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">企業名</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">雇用形態</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">給与</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">ステータス</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {jobs?.map((job) => {
              const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;
              return (
                <tr key={job.id} className="hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-4 font-medium text-[var(--color-text-primary)] max-w-xs truncate">{job.title}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{company?.company_name ?? "-"}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{formatEmploymentType(job.employment_type)}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{formatSalary(job.salary_min, job.salary_max)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      job.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {job.is_published ? "公開中" : "下書き"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={job.id} />
                      <input type="hidden" name="current" value={String(job.is_published)} />
                      <button className="text-xs text-[var(--color-brand)] hover:underline">
                        {job.is_published ? "非公開" : "公開"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!jobs || jobs.length === 0) && (
          <p className="text-center py-12 text-[var(--color-text-muted)]">求人がありません</p>
        )}
      </div>
    </div>
  );
}
