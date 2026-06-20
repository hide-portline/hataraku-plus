import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import JobCard from "@/components/job/JobCard";
import JobFilters from "@/components/job/JobFilters";
import Pagination from "@/components/ui/Pagination";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "求人一覧",
  description: "淡路島の求人情報一覧。正社員・契約社員・パートなど多様な雇用形態で、あなたの価値観に合った仕事を探せます。移住・UIターン歓迎の求人も掲載。",
  openGraph: {
    title: "求人一覧 | Hataraku+淡路島",
    description: "淡路島の求人を価値観で探す。",
    url: "/jobs",
  },
};

const PAGE_SIZE = 12;

type SearchParams = Promise<{
  employment_type?: string;
  work_style?: string;
  values_type?: string;
  page?: string;
}>;

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createClient();

  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  let query = supabase
    .from("jobs")
    .select("*, companies(company_name, logo_url)", { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (params.employment_type) query = query.eq("employment_type", params.employment_type as "fulltime" | "parttime" | "contract");
  if (params.work_style) query = query.eq("work_style", params.work_style as "remote" | "onsite" | "hybrid");
  if (params.values_type) query = query.eq("values_type", params.values_type as "challenger" | "stable" | "team" | "specialist");

  const { data: jobs, count } = await query;
  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const isFiltered = !!(params.employment_type || params.work_style || params.values_type);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-24">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-text-muted)] mb-4">
            Jobs
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.9] tracking-tight text-[var(--color-text-primary)]">
              求人を<br />探す
            </h1>
            <div className="text-right">
              <p className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed mb-3">
                地方でのキャリアも、価値観にフィットする企業も。<br />あなたの働き方に合った求人を。
              </p>
              <span className="inline-block px-4 py-2 rounded-full border border-[var(--color-border)] text-sm font-extrabold text-[var(--color-text-primary)]">
                {isFiltered ? `${totalCount} 件ヒット` : `公開中 ${totalCount} 件`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Suspense>
          <JobFilters />
        </Suspense>

        {!jobs || jobs.length === 0 ? (
          <div className="text-center py-32 text-[var(--color-text-muted)]">
            <p className="font-semibold">
              {isFiltered ? "条件に合う求人が見つかりませんでした" : "まもなく求人が掲載されます"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 mt-8">
              {jobs.map((job, i) => (
                <Reveal key={job.id} delay={i % 3 * 80}>
                  <JobCard job={job} />
                </Reveal>
              ))}
            </div>
            <Suspense>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
