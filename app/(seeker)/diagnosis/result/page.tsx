import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResultCard from "@/components/diagnosis/ResultCard";
import CompanyCard from "@/components/company/CompanyCard";
import type { ValuesType, DiagnosisScores } from "@/types/database";

export default async function DiagnosisResultPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: result } = await supabase
    .from("user_diagnosis_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!result) redirect("/diagnosis");

  const scores: DiagnosisScores = {
    challenger: result.score_challenger,
    stable: result.score_stable,
    team: result.score_team,
    specialist: result.score_specialist,
  };

  // 同タイプの企業を取得
  const { data: matchedCompanies } = await supabase
    .from("companies")
    .select("*, regions(name)")
    .eq("status", "approved")
    .eq("values_type", result.values_type)
    .limit(3);

  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <div className="bg-[var(--color-brand)] text-white text-center py-10">
        <h1 className="text-2xl font-bold">診断結果</h1>
        <p className="text-white/70 text-sm mt-1">あなたの価値観タイプが判明しました</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <ResultCard type={result.values_type as ValuesType} scores={scores} />

        {/* おすすめ企業 */}
        {matchedCompanies && matchedCompanies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              あなたにおすすめの企業
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              同じ価値観タイプの企業を厳選しました。
            </p>
            <div className="flex flex-col gap-4">
              {matchedCompanies.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/companies" className="flex-1">
            <button className="w-full py-3 rounded-full bg-[var(--color-brand)] text-white font-semibold hover:bg-[var(--color-brand-dark)] transition-colors">
              すべての企業を見る
            </button>
          </Link>
          <Link href="/diagnosis" className="flex-1">
            <button className="w-full py-3 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold hover:bg-white transition-colors">
              再診断する
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
