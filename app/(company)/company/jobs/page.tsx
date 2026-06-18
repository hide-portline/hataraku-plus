import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/Button";
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
  redirect("/company/jobs");
}

async function deleteJob(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("jobs").delete().eq("id", id);
  redirect("/company/jobs");
}

export default async function CompanyJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  if (!membership) redirect("/dashboard");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", membership.company_id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">求人管理</h1>
        <Link href="/company/jobs/new">
          <Button variant="primary">+ 新規求人を作成</Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        {!jobs || jobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)] mb-4">まだ求人がありません</p>
            <Link href="/company/jobs/new">
              <Button variant="secondary">最初の求人を作成する</Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">求人タイトル</th>
                <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">雇用形態</th>
                <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">給与</th>
                <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">ステータス</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{job.title}</td>
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
                    <div className="flex items-center gap-3 justify-end">
                      <form action={togglePublish}>
                        <input type="hidden" name="id" value={job.id} />
                        <input type="hidden" name="current" value={String(job.is_published)} />
                        <button className="text-xs text-[var(--color-brand)] hover:underline">
                          {job.is_published ? "非公開にする" : "公開する"}
                        </button>
                      </form>
                      <form action={deleteJob}>
                        <input type="hidden" name="id" value={job.id} />
                        <button className="text-xs text-red-500 hover:underline">削除</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
