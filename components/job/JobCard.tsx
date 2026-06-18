import Link from "next/link";
import Image from "next/image";
import type { JobRow, CompanyRow } from "@/types/database";
import ValuesTypeBadge from "@/components/company/ValuesTypeBadge";
import { formatSalary, formatEmploymentType, formatWorkStyle } from "@/lib/utils/format";

type Props = {
  job: JobRow & { companies: Pick<CompanyRow, "company_name" | "logo_url"> | null };
};

export default function JobCard({ job }: Props) {
  const company = job.companies;

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div className="bg-white rounded-[28px] border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0">
              {company?.logo_url ? (
                <Image
                  src={company.logo_url}
                  alt={company.company_name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <span className="text-sm font-bold text-[var(--color-brand)]">
                  {company?.company_name?.charAt(0) ?? "?"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-1">
                {company?.company_name ?? "企業名なし"}
              </p>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors leading-snug">
                {job.title}
              </h3>
            </div>
          </div>
          {job.values_type && <ValuesTypeBadge type={job.values_type} size="md" />}
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
          {job.description ?? "仕事内容の概要がありません。詳細ページでご確認ください。"}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-3 py-1 rounded-full border border-[var(--color-border)]">
            {formatEmploymentType(job.employment_type)}
          </span>
          {job.work_style && (
            <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-3 py-1 rounded-full border border-[var(--color-border)]">
              {formatWorkStyle(job.work_style)}
            </span>
          )}
          {job.location && (
            <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-3 py-1 rounded-full border border-[var(--color-border)]">
              📍 {job.location}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)] text-sm">
          <span className="font-semibold text-[var(--color-text-primary)]">
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {company?.company_name ? `${company.company_name} 発` : "求人情報"}
          </span>
        </div>
      </div>
    </Link>
  );
}
