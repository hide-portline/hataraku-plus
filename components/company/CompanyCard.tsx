import Link from "next/link";
import Image from "next/image";
import type { CompanyRow } from "@/types/database";
import ValuesTypeBadge from "./ValuesTypeBadge";

type Props = {
  company: CompanyRow & { regions?: { name: string } | null };
};

export default function CompanyCard({ company }: Props) {
  return (
    <Link href={`/companies/${company.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 h-full flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0">
            {company.logo_url ? (
              <Image src={company.logo_url} alt={company.company_name} width={48} height={48} className="object-contain" />
            ) : (
              <span className="text-xl font-bold text-[var(--color-brand)]">
                {company.company_name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-brand)] transition-colors">
              {company.company_name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {company.industry ?? "業種未設定"}
              {company.regions && ` · ${company.regions.name}`}
            </p>
          </div>
        </div>

        {/* 説明 */}
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 flex-1 mb-4">
          {company.description ?? "企業情報を準備中です。"}
        </p>

        {/* フッター */}
        <div className="flex items-center justify-between">
          {company.values_type && (
            <ValuesTypeBadge type={company.values_type} />
          )}
          {company.employee_count && (
            <span className="text-xs text-[var(--color-text-muted)]">
              {company.employee_count}名
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
