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
    <Link href={`/jobs/${job.id}`} className="group block border-t border-[var(--color-border)] pt-6 pb-8">
      {/* 企業名 + ロゴ */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0">
          {company?.logo_url ? (
            <Image src={company.logo_url} alt={company.company_name} width={24} height={24} className="object-contain" />
          ) : (
            <span className="text-[9px] font-bold text-[var(--color-brand)]">
              {company?.company_name?.charAt(0) ?? "?"}
            </span>
          )}
        </div>
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
          {company?.company_name ?? "—"}
          {job.location && <span className="ml-1.5">· {job.location}</span>}
        </p>
      </div>

      {/* タイトル */}
      <h3 className="text-xl font-extrabold text-[var(--color-text-primary)] leading-snug mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-200">
        {job.title}
      </h3>

      {/* 説明 */}
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 mb-4">
        {job.description ?? "詳細ページでご確認ください。"}
      </p>

      {/* メタ情報 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-[var(--color-text-muted)]">{formatEmploymentType(job.employment_type)}</span>
          {job.work_style && (
            <span className="text-xs text-[var(--color-text-muted)]">· {formatWorkStyle(job.work_style)}</span>
          )}
          {job.values_type && <ValuesTypeBadge type={job.values_type} size="sm" />}
        </div>
        <span className="text-sm font-bold text-[var(--color-text-primary)] shrink-0">
          {formatSalary(job.salary_min, job.salary_max)}
        </span>
      </div>
    </Link>
  );
}
