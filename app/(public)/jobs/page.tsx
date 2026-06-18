import { createClient } from "@/lib/supabase/server";
import JobCard from "@/components/job/JobCard";

export const revalidate = 3600;

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, companies(company_name, logo_url)")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">求人を見る</h1>
        <p className="text-[var(--color-text-secondary)]">
          あなたの価値観に合ったポジションを見つけましょう。
        </p>
      </div>

      {!jobs || jobs.length === 0 ? (
        <div className="text-center py-24 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-4">📋</p>
          <p className="font-semibold">まもなく求人が掲載されます</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
