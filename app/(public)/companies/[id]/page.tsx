import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ValuesTypeBadge from "@/components/company/ValuesTypeBadge";
import CompanyJobCard from "@/components/job/CompanyJobCard";
import InterviewCarousel from "@/components/article/InterviewCarousel";
import { VALUES_TYPE_DESCRIPTIONS } from "@/lib/utils/diagnosis";
import type { ValuesType } from "@/types/database";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("company_name, description, industry")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (!company) return { title: "企業詳細" };
  return {
    title: company.company_name,
    description: company.description?.slice(0, 120) ?? `${company.company_name}の企業情報・求人情報。`,
    openGraph: {
      title: `${company.company_name} | Hataraku+淡路島`,
      description: company.description?.slice(0, 120) ?? `${company.company_name}の企業情報。`,
      url: `/companies/${id}`,
    },
  };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: company }, { data: interviews }] = await Promise.all([
    supabase
      .from("companies")
      .select(`*, regions(name), jobs(*, companies(company_name, logo_url))`)
      .eq("id", id)
      .eq("status", "approved")
      .single(),
    supabase
      .from("articles")
      .select("*, companies(company_name)")
      .eq("is_published", true)
      .eq("article_type", "interview")
      .eq("company_id", id)
      .order("published_at", { ascending: false })
      .limit(8),
  ]);

  if (!company) notFound();

  const publishedJobs = (company.jobs ?? []).filter((j: { is_published: boolean }) => j.is_published);

  return (
    <div>
      {/* ヒーロー */}
      <div className="bg-[var(--color-brand)] text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
            {company.logo_url ? (
              <Image src={company.logo_url} alt={company.company_name} width={96} height={96} className="object-contain" />
            ) : (
              <span className="text-4xl font-bold">{company.company_name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {company.regions && (
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full">🏝️ {company.regions.name}</span>
              )}
              {company.industry && (
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full">{company.industry}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{company.company_name}</h1>
            {company.vision && <p className="text-white/80 text-lg italic">"{company.vision}"</p>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-10">
        {/* 価値観タイプ */}
        {company.values_type && (
          <section className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">この企業の価値観タイプ</h2>
            <div className="flex items-start gap-4">
              <ValuesTypeBadge type={company.values_type as ValuesType} size="md" />
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {VALUES_TYPE_DESCRIPTIONS[company.values_type as ValuesType]}
              </p>
            </div>
          </section>
        )}

        {/* 企業概要 */}
        {company.description && (
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">会社について</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{company.description}</p>
          </section>
        )}

        {/* 企業文化 */}
        {company.culture_description && (
          <section className="bg-[var(--color-surface)] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">カルチャー・働き方</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{company.culture_description}</p>
          </section>
        )}

        {/* 基本情報 */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">基本情報</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {company.employee_count && (
              <><dt className="text-[var(--color-text-muted)]">従業員数</dt><dd className="font-medium">{company.employee_count}名</dd></>
            )}
            {company.founded_year && (
              <><dt className="text-[var(--color-text-muted)]">設立年</dt><dd className="font-medium">{company.founded_year}年</dd></>
            )}
            {company.location && (
              <><dt className="text-[var(--color-text-muted)]">所在地</dt><dd className="font-medium">{company.location}</dd></>
            )}
            {company.website_url && (
              <><dt className="text-[var(--color-text-muted)]">ウェブサイト</dt>
                <dd><a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] hover:underline">{company.website_url}</a></dd></>
            )}
          </dl>
        </section>

        {/* 求人一覧 */}
        {publishedJobs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                募集中のポジション <span className="text-sm font-normal text-[var(--color-text-muted)]">({publishedJobs.length}件)</span>
              </h2>
              <Link href="/jobs" className="text-sm text-[var(--color-brand)] hover:underline">
                すべての求人を見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedJobs.map((job: import("@/types/database").JobRow, index: number) => (
                <CompanyJobCard
                  key={job.id}
                  job={job}
                  photoUrl={company.photo_urls?.[index % (company.photo_urls?.length ?? 1)] ?? null}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ━━ 社員インタビュー ━━ */}
      <InterviewCarousel articles={interviews ?? []} />
    </div>
  );
}
