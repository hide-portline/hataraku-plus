import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CompanyCard from "@/components/company/CompanyCard";
import { retakeDiagnosis } from "@/lib/actions/diagnosis";
import {
  VALUES_TYPE_LABELS,
  VALUES_TYPE_DESCRIPTIONS,
  VALUES_TYPE_ICONS,
} from "@/lib/utils/diagnosis";
import type { ValuesType, DiagnosisScores } from "@/types/database";

const TYPE_BG: Record<ValuesType, string> = {
  challenger: "bg-[#1a0a00]",
  stable:     "bg-[#00140a]",
  team:       "bg-[#000d1a]",
  specialist: "bg-[#0d0014]",
};

const TYPE_ACCENT: Record<ValuesType, string> = {
  challenger: "text-[var(--color-accent)]",
  stable:     "text-emerald-400",
  team:       "text-sky-400",
  specialist: "text-violet-400",
};

const TYPE_BAR: Record<ValuesType, string> = {
  challenger: "bg-[var(--color-accent)]",
  stable:     "bg-emerald-400",
  team:       "bg-sky-400",
  specialist: "bg-violet-400",
};

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

  const type = result.values_type as ValuesType;
  const scores: DiagnosisScores = {
    challenger: result.score_challenger,
    stable: result.score_stable,
    team: result.score_team,
    specialist: result.score_specialist,
  };
  const MAX = 20;
  const sortedScores = (Object.entries(scores) as [ValuesType, number][]).sort(([, a], [, b]) => b - a);

  const { data: matchScores } = await supabase
    .from("matching_scores")
    .select("company_id, score")
    .eq("user_id", user.id);
  const scoreMap = new Map(matchScores?.map((s) => [s.company_id, s.score]) ?? []);

  const { data: matchedCompanies } = await supabase
    .from("companies")
    .select("*, regions(name)")
    .eq("status", "approved")
    .eq("values_type", type)
    .limit(6);

  const { data: matchedJobs } = await supabase
    .from("jobs")
    .select("id, title, location, employment_type, salary_min, salary_max, companies(company_name)")
    .eq("is_published", true)
    .eq("values_type", type)
    .limit(4);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* ヒーロー：タイプ発表 */}
      <div className={`${TYPE_BG[type]} text-white`}>
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-36 text-center">
          <p className="animate-fade-up text-xs font-semibold tracking-[0.3em] uppercase text-white/30 mb-8">
            Your Values Type
          </p>
          <div className="animate-scale-in text-8xl md:text-[10rem] mb-6 select-none">
            {VALUES_TYPE_ICONS[type]}
          </div>
          <h1 className={`animate-fade-up-2 text-[clamp(2.2rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-tight mb-6 ${TYPE_ACCENT[type]}`}>
            {VALUES_TYPE_LABELS[type]}
          </h1>
          <p className="animate-fade-up-3 text-base md:text-lg text-white/60 leading-relaxed max-w-md mx-auto">
            {VALUES_TYPE_DESCRIPTIONS[type]}
          </p>
        </div>
      </div>

      {/* スコアバー */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-8">
            Score Breakdown
          </p>
          <div className="flex flex-col gap-6">
            {sortedScores.map(([t, score]) => (
              <div key={t}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-extrabold text-sm text-[var(--color-text-primary)]">
                    {VALUES_TYPE_ICONS[t]} {VALUES_TYPE_LABELS[t]}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                    {score} / {MAX}
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${TYPE_BAR[t]}`}
                    style={{ width: `${(score / MAX) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* おすすめ企業 */}
      {matchedCompanies && matchedCompanies.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-[var(--color-border)]">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-3">
              Matched Companies
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)]">
              あなたにおすすめの企業
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              価値観タイプが一致する淡路島の企業です。
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {matchedCompanies.map((c) => {
              const matchScore = scoreMap.get(c.id);
              return (
                <div key={c.id} className="relative">
                  {matchScore !== undefined && (
                    <div className="absolute top-0 right-0 z-10 bg-[var(--color-text-primary)] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                      マッチ度 {matchScore}%
                    </div>
                  )}
                  <CompanyCard company={c} />
                </div>
              );
            })}
          </div>
          <Link href="/companies" className="block mt-8 text-center text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">
            すべての企業を見る →
          </Link>
        </div>
      )}

      {/* おすすめ求人 */}
      {matchedJobs && matchedJobs.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 py-16 border-b border-[var(--color-border)]">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-3">
              Matched Jobs
            </p>
            <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
              おすすめの求人
            </h2>
          </div>
          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            {matchedJobs.map((job) => {
              const companyName = Array.isArray(job.companies)
                ? job.companies[0]?.company_name
                : (job.companies as { company_name: string } | null)?.company_name;
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex justify-between items-center py-5 group"
                >
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">{companyName}</p>
                    <p className="font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                      {job.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{job.location}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    {job.salary_min && (
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">
                        {job.salary_min}〜{job.salary_max}万
                      </p>
                    )}
                    <span className="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors">
                      詳細 →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/jobs" className="block mt-6 text-center text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">
            すべての求人を見る →
          </Link>
        </div>
      )}

      {/* アクション */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/companies" className="flex-1">
            <div className="w-full py-4 rounded-2xl bg-[var(--color-text-primary)] text-white text-sm font-bold text-center hover:bg-[var(--color-brand)] transition-colors">
              企業一覧を見る
            </div>
          </Link>
          <form action={retakeDiagnosis} className="flex-1">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              もう一度診断する
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
