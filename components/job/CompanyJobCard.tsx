import Link from "next/link";
import Image from "next/image";
import type { JobRow, ValuesType } from "@/types/database";
import ValuesTypeBadge from "@/components/company/ValuesTypeBadge";
import { formatSalary } from "@/lib/utils/format";

type Props = {
  job: JobRow;
  photoUrl?: string | null;
};

const EMPLOYMENT_BADGE: Record<string, { label: string; cls: string }> = {
  fulltime: { label: "正社員",           cls: "bg-[var(--color-brand)] text-white" },
  parttime: { label: "パート・アルバイト", cls: "border border-emerald-500 text-emerald-600" },
  contract: { label: "契約社員",          cls: "border border-gray-400 text-gray-600" },
};

export default function CompanyJobCard({ job, photoUrl }: Props) {
  const badge = EMPLOYMENT_BADGE[job.employment_type] ?? {
    label: job.employment_type,
    cls: "border border-gray-400 text-gray-600",
  };

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* 写真 */}
      <div className="relative aspect-[3/2] bg-[var(--color-surface)]">
        <Image
          src={photoUrl ?? `https://picsum.photos/seed/${job.id}/600/400`}
          alt={job.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* テキスト */}
      <div className="p-5">
        <h3 className="font-bold text-[var(--color-text-primary)] text-base leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-150">
          {job.title}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4 leading-relaxed">
          {job.description ?? "詳細ページでご確認ください。"}
        </p>

        {/* バッジ + 給与 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center text-[10px] font-semibold rounded-full px-2 py-0.5 ${badge.cls}`}>
              {badge.label}
            </span>
            {job.values_type && (
              <ValuesTypeBadge type={job.values_type as ValuesType} size="sm" />
            )}
          </div>
          <span className="text-sm font-bold text-[var(--color-text-primary)] shrink-0">
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
        </div>
      </div>
    </Link>
  );
}
