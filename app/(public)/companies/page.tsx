import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import CompanyCard from "@/components/company/CompanyCard";
import CompanyFilters from "@/components/company/CompanyFilters";
import Pagination from "@/components/ui/Pagination";

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
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="border-b border-[var(--color-border)] pb-12 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-3">
            Companies
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)]">
            淡路島の企業を探す
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] shrink-0">
          {isFiltered ? `${totalCount} 社ヒット` : `${totalCount} 社掲載中`}
        </p>
      </div>

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
            {companies.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
          <Suspense>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </>
      )}
    </div>
  );
}
