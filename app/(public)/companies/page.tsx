import { createClient } from "@/lib/supabase/server";
import CompanyCard from "@/components/company/CompanyCard";

export const revalidate = 3600;

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("*, regions(name)")
    .eq("status", "approved")
    .order("approved_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">企業を探す</h1>
        <p className="text-[var(--color-text-secondary)]">
          淡路島で働く、価値観が合う企業を見つけましょう。
        </p>
      </div>

      {!companies || companies.length === 0 ? (
        <div className="text-center py-24 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-4">🏝️</p>
          <p className="font-semibold">まもなく企業が掲載されます</p>
          <p className="text-sm mt-1">準備ができ次第お知らせします。</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )}
    </div>
  );
}
