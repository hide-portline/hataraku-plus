import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import CompanyCard from "@/components/company/CompanyCard";
import CompanyFilters from "@/components/company/CompanyFilters";
import Pagination from "@/components/ui/Pagination";
import Reveal from "@/components/ui/Reveal";
import InterviewCarousel from "@/components/article/InterviewCarousel";
import type { ValuesType } from "@/types/database";

export const metadata: Metadata = {
  title: "企業を探す | Hataraku+淡路島",
  description: "淡路島の企業を、文化や価値観から探せます。あなたに合う一社と、きっと出会える。",
  openGraph: {
    title: "企業を探す | Hataraku+淡路島",
    description: "淡路島の企業を文化・価値観から探す。",
    url: "/companies",
  },
};

const PAGE_SIZE = 12;

type SearchParams = Promise<{
  values_type?: string;
  page?: string;
  q?: string;
  region?: string;
  industry?: string;
}>;

export default async function CompaniesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createClient();

  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  // サイドデータ並行取得
  const [{ data: regions }, { data: allCompanies }, { data: interviews }] = await Promise.all([
    supabase.from("regions").select("id, name, slug").eq("is_active", true).order("display_order"),
    supabase.from("companies").select("industry, values_type").eq("status", "approved"),
    supabase
      .from("articles")
      .select("*, companies(company_name)")
      .eq("is_published", true)
      .eq("article_type", "interview")
      .order("published_at", { ascending: false })
      .limit(8),
  ]);

  // 業種一覧（重複排除）
  const industries = [
    ...new Set(
      allCompanies?.map((c) => c.industry).filter((v): v is string => !!v) ?? []
    ),
  ].sort();

  // タイプ別件数
  const typeCounts: Record<string, number> = {
    challenger: allCompanies?.filter((c) => c.values_type === "challenger").length ?? 0,
    stable:     allCompanies?.filter((c) => c.values_type === "stable").length ?? 0,
    team:       allCompanies?.filter((c) => c.values_type === "team").length ?? 0,
    specialist: allCompanies?.filter((c) => c.values_type === "specialist").length ?? 0,
  };
  const totalAllCount = allCompanies?.length ?? 0;

  // メインクエリ（フィルタ適用）
  let query = supabase
    .from("companies")
    .select("*, regions(name)", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (params.values_type) {
    query = query.eq("values_type", params.values_type as ValuesType);
  }
  if (params.q) {
    query = query.or(`company_name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }
  if (params.industry) {
    query = query.eq("industry", params.industry);
  }
  if (params.region) {
    const regionRow = regions?.find((r) => r.slug === params.region);
    if (regionRow) query = query.eq("region_id", regionRow.id);
  }

  const { data: companies, count } = await query;
  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen">
      {/* ━━ HERO ━━ */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--color-text-primary)] mb-4">
                企業を探す
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                淡路島の企業を、文化や価値観から探せます。あなたに合う一社と、きっと出会える。
              </p>
            </div>
            <span className="shrink-0 inline-block px-5 py-2 rounded-full border border-[var(--color-border)] text-sm font-extrabold text-[var(--color-text-primary)]">
              {totalAllCount} 社掲載中
            </span>
          </div>
        </div>
      </div>

      {/* ━━ 社員インタビュー ━━ */}
      <InterviewCarousel articles={interviews ?? []} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Suspense>
          <CompanyFilters
            regions={regions ?? []}
            industries={industries}
            typeCounts={typeCounts}
            totalCount={totalAllCount}
          />
        </Suspense>

        {!companies || companies.length === 0 ? (
          <div className="py-32 text-center text-[var(--color-text-muted)]">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-semibold">条件に合う企業が見つかりませんでした</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {companies.map((c, i) => (
                <Reveal key={c.id} delay={i % 3 * 80}>
                  <CompanyCard company={c} />
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
