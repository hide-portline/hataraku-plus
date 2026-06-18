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

  // マッチングスコア済みの企業を取得（企業診断済みの場合）
  const { data: matchScores } = await supabase
    .from("matching_scores")
    .select("company_id, score")
    .eq("user_id", user.id);

  const scoreMap = new Map(matchScores?.map((s) => [s.company_id, s.score]) ?? []);

  // 同タイプの企業を6社取得
  const { data: matchedCompanies } = await supabase
    .from("companies")
    .select("*, regions(name)")
    .eq("status", "approved")
    .eq("values_type", result.values_type)
    .limit(6);

  // おすすめ求人（同タイプ）
  const { data: matchedJobs } = await supabase
    .from("jobs")
    .select("id, title, location, employment_type, salary_min, salary_max, companies(company_name)")
    .eq("is_published", true)
    .eq("values_type", result.values_type)
    .limit(4);

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
              価値観タイプが一致する淡路島の企業です。
            </p>
            <div className="flex flex-col gap-6">
              {matchedCompanies.map((c) => {
                const matchScore = scoreMap.get(c.id);
                return (
                  <div key={c.id} className="relative">
                    {matchScore !== undefined && (
                      <div className="absolute top-0 right-0 z-10 bg-[var(--color-brand)] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                        マッチ度 {matchScore}%
                      </div>
                    )}
                    <CompanyCard company={c} />
                  </div>
                );
              })}
            </div>
            <Link href="/companies" className="block mt-6 text-center text-sm text-[var(--color-brand)] hover:underline">
              すべての企業を見る →
            </Link>
          </div>
        )}

        {/* おすすめ求人 */}
        {matchedJobs && matchedJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              おすすめの求人
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              あなたの価値観に合った求人をピックアップしました。
            </p>
            <div className="flex flex-col gap-3">
              {matchedJobs.map((job) => {
                const companyName = Array.isArray(job.companies)
                  ? job.companies[0]?.company_name
                  : (job.companies as { company_name: string } | null)?.company_name;
                return (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm px-5 py-4 flex justify-between items-center hover:border-[var(--color-brand)] transition-colors group"
                  >
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-1">{companyName}</p>
                      <p className="font-semibold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                        {job.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{job.location}</p>
                    </div>
                    {job.salary_min && (
                      <p className="text-sm font-bold text-[var(--color-brand)] shrink-0 ml-4">
                        {job.salary_min}〜{job.salary_max}万
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
            <Link href="/jobs" className="block mt-6 text-center text-sm text-[var(--color-brand)] hover:underline">
              すべての求人を見る →
            </Link>
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
