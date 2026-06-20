import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import CompanyCard from "@/components/company/CompanyCard";
import CompanyFilters from "@/components/company/CompanyFilters";
import Pagination from "@/components/ui/Pagination";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "企業一覧",
  description: "淡路島で働く企業の一覧。農業・観光・IT・食品加工など多様な業種の企業が価値観とともに掲載されています。移住・UIターン就職にも対応。",
  openGraph: {
    title: "企業一覧 | Hataraku+淡路島",
    description: "淡路島で働く企業を価値観で探す。",
    url: "/companies",
  },
};

const PAGE_SIZE = 12;

type SearchParams = Promise<{ values_type?: string; page?: string }>;

export default async function CompaniesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createClient();

  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  let query = supabase
    .from("companies")
    .select("*, regions(name)", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (params.values_type) query = query.eq("values_type", params.values_type as "challenger" | "stable" | "team" | "specialist");

  const { data: companies, count } = await query;
  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const isFiltered = !!params.values_type;

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-24">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-text-muted)] mb-4">
            Companies
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.9] tracking-tight text-[var(--color-text-primary)]">
              企業を<br />探す
            </h1>
            <div className="text-right">
              <p className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed mb-3">
                農業・観光・IT・食品加工まで。<br />淡路島で働く企業の価値観を知る。
              </p>
              <span className="inline-block px-4 py-2 rounded-full border border-[var(--color-border)] text-sm font-extrabold text-[var(--color-text-primary)]">
                {isFiltered ? `${totalCount} 社ヒット` : `${totalCount} 社掲載中`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

      <Suspense>
        <CompanyFilters />
      </Suspense>

      {!companies || companies.length === 0 ? (
        <div className="py-32 text-center text-[var(--color-text-muted)]">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-semibold">
            {isFiltered ? "条件に合う企業が見つかりませんでした" : "まもなく企業が掲載されます"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
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
