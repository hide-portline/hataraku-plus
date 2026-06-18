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
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col gap-3">
        {/* 企業情報 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0">
            {company?.logo_url ? (
              <Image src={company.logo_url} alt={company.company_name} width={32} height={32} className="object-contain" />
            ) : (
              <span className="text-xs font-bold text-[var(--color-brand)]">
                {company?.company_name.charAt(0) ?? "?"}
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--color-text-secondary)]">{company?.company_name}</span>
        </div>

        {/* 求人タイトル */}
        <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors leading-snug">
          {job.title}
        </h3>

        {/* メタ情報 */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
            {formatEmploymentType(job.employment_type)}
          </span>
          {job.work_style && (
            <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
              {formatWorkStyle(job.work_style)}
            </span>
          )}
          {job.location && (
            <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
              📍 {job.location}
            </span>
          )}
        </div>

        {/* 給与 + 価値観タイプ */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
          {job.values_type && <ValuesTypeBadge type={job.values_type} />}
        </div>
      </div>
    </Link>
  );
}
