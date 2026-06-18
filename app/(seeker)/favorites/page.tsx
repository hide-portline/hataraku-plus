import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function removeFavorite(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("favorites").delete().eq("id", id);
  redirect("/favorites");
}

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: favorites } = await supabase
    .from("favorites")
    .select("id, job_id, company_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const jobIds = favorites?.filter((f) => f.job_id).map((f) => f.job_id!) ?? [];
  const companyIds = favorites?.filter((f) => f.company_id).map((f) => f.company_id!) ?? [];

  const [{ data: jobs }, { data: companies }] = await Promise.all([
    jobIds.length > 0
      ? supabase.from("jobs").select("id, title, companies(company_name, logo_url)").in("id", jobIds)
      : Promise.resolve({ data: [] }),
    companyIds.length > 0
      ? supabase.from("companies").select("id, company_name, logo_url, industry, values_type").in("id", companyIds)
      : Promise.resolve({ data: [] }),
  ]);

  const jobMap = Object.fromEntries(jobs?.map((j) => [j.id, j]) ?? []);
  const companyMap = Object.fromEntries(companies?.map((c) => [c.id, c]) ?? []);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/mypage" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">← マイページ</Link>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">お気に入り</h1>
        </div>

        {!favorites || favorites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm text-center py-16">
            <p className="text-4xl mb-4">🔖</p>
            <p className="font-semibold text-[var(--color-text-primary)] mb-1">お気に入りがありません</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">気になる求人・企業をお気に入りに追加しましょう</p>
            <div className="flex gap-3 justify-center">
              <Link href="/jobs" className="inline-block px-5 py-2.5 rounded-full bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-colors">
                求人を探す
              </Link>
              <Link href="/companies" className="inline-block px-5 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-white transition-colors">
                企業を見る
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favorites.map((fav) => {
              if (fav.job_id) {
                const job = jobMap[fav.job_id];
                if (!job) return null;
                const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;
                return (
                  <div key={fav.id} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--color-text-muted)] mb-1">求人 · {company?.company_name ?? "-"}</p>
                      <Link href={`/jobs/${fav.job_id}`} className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand)] transition-colors">
                        {job.title}
                      </Link>
                    </div>
                    <form action={removeFavorite}>
                      <input type="hidden" name="id" value={fav.id} />
                      <button className="text-xs text-red-500 hover:underline shrink-0">削除</button>
                    </form>
                  </div>
                );
              }
              if (fav.company_id) {
                const company = companyMap[fav.company_id];
                if (!company) return null;
                return (
                  <div key={fav.id} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--color-text-muted)] mb-1">企業 · {company.industry ?? "-"}</p>
                      <Link href={`/companies/${fav.company_id}`} className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand)] transition-colors">
                        {company.company_name}
                      </Link>
                    </div>
                    <form action={removeFavorite}>
                      <input type="hidden" name="id" value={fav.id} />
                      <button className="text-xs text-red-500 hover:underline shrink-0">削除</button>
                    </form>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
