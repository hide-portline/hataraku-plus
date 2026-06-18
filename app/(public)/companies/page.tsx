import { createClient } from "@/lib/supabase/server";
import CompanyCard from "@/components/company/CompanyCard";

export const revalidate = 3600;

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("*, regions(name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="border-b border-[var(--color-border)] pb-12 mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-3">
            Companies
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)]">
            淡路島の企業を探す
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{companies?.length ?? 0} 社掲載中</p>
      </div>

      {!companies || companies.length === 0 ? (
        <div className="py-32 text-center text-[var(--color-text-muted)]">
          <p className="font-semibold">まもなく企業が掲載されます</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )}
    </div>
  );
}
