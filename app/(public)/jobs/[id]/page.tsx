import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ValuesTypeBadge from "@/components/company/ValuesTypeBadge";
import Button from "@/components/ui/Button";
import { formatSalary, formatEmploymentType, formatWorkStyle } from "@/lib/utils/format";
import type { ValuesType } from "@/types/database";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("title, description, companies(company_name)")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!job) return { title: "求人詳細" };
  const companyName = Array.isArray(job.companies) ? job.companies[0]?.company_name : (job.companies as { company_name: string } | null)?.company_name;
  return {
    title: job.title,
    description: job.description?.slice(0, 120) ?? `${companyName ?? ""}の求人情報。淡路島での働き方をご確認ください。`,
    openGraph: {
      title: `${job.title} | Hataraku+淡路島`,
      description: job.description?.slice(0, 120) ?? `${companyName ?? ""}の求人情報。`,
      url: `/jobs/${id}`,
    },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*, companies(id, company_name, logo_url, industry, values_type)")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!job) notFound();

  const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/jobs" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] mb-6 inline-block">
        ← 求人一覧へ
      </Link>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-8 mb-6">
        {/* ヘッダー */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">
            {formatEmploymentType(job.employment_type)}
          </span>
          {job.work_style && (
            <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">
              {formatWorkStyle(job.work_style)}
            </span>
          )}
          {job.values_type && <ValuesTypeBadge type={job.values_type as ValuesType} />}
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{job.title}</h1>

        {company && (
          <Link href={`/companies/${company.id}`} className="text-sm text-[var(--color-brand)] hover:underline">
            {company.company_name}
          </Link>
        )}

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
          <div className="text-sm">
            <span className="text-[var(--color-text-muted)]">給与</span>
            <span className="ml-2 font-semibold text-[var(--color-text-primary)]">
              {formatSalary(job.salary_min, job.salary_max)}
            </span>
          </div>
          {job.location && (
            <div className="text-sm">
              <span className="text-[var(--color-text-muted)]">勤務地</span>
              <span className="ml-2 font-semibold text-[var(--color-text-primary)]">{job.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 詳細 */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {job.description && (
            <section className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-3">仕事内容</h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{job.description}</p>
            </section>
          )}
          {job.required_skills && (
            <section className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-3">求めるスキル・経験</h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{job.required_skills}</p>
            </section>
          )}
          {job.benefits && (
            <section className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-3">待遇・福利厚生</h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{job.benefits}</p>
            </section>
          )}
        </div>

        {/* サイドバー */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sticky top-20">
            <Link href={`/login?redirect=/jobs/${id}`}>
              <Button className="w-full mb-3">応募する</Button>
            </Link>
            <p className="text-xs text-center text-[var(--color-text-muted)]">
              応募にはログインが必要です
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
