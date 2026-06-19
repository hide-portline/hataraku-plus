import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import JobCard from "@/components/job/JobCard";
import JobFilters from "@/components/job/JobFilters";

type SearchParams = Promise<{
  employment_type?: string;
  work_style?: string;
  values_type?: string;
}>;

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*, companies(company_name, logo_url)")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (params.employment_type) query = query.eq("employment_type", params.employment_type as "fulltime" | "parttime" | "contract");
  if (params.work_style) query = query.eq("work_style", params.work_style as "remote" | "onsite" | "hybrid");
  if (params.values_type) query = query.eq("values_type", params.values_type as "challenger" | "stable" | "team" | "specialist");

  const { data: jobs } = await query;
  const totalJobs = jobs?.length ?? 0;
  const isFiltered = !!(params.employment_type || params.work_style || params.values_type);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-brand)] mb-2">
            求人一覧
          </p>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">淡路島・周辺の求人を探す</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl">
            地方でのキャリアも、価値観にフィットする企業も。あなたの働き方に合った求人を見つけてください。
          </p>
        </div>
        <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] shrink-0">
          {isFiltered ? `${totalJobs} 件ヒット` : `公開求人 ${totalJobs} 件`}
        </div>
      </div>

      <Suspense>
        <JobFilters />
      </Suspense>

      {!jobs || jobs.length === 0 ? (
        <div className="text-center py-24 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-4">{isFiltered ? "🔍" : "📋"}</p>
          <p className="font-semibold">
            {isFiltered ? "条件に合う求人が見つかりませんでした" : "まもなく求人が掲載されます"}
          </p>
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
