import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CompanyRow } from "@/types/database";

type Props = {
  company: CompanyRow & { regions?: { name: string } | null };
};

const typeConfig: Record<string, { bg: string; label: string }> = {
  challenger: { bg: "bg-[#E8792A]",   label: "Challenger" },
  stable:     { bg: "bg-[#2D3A4B]",   label: "Stable" },
  team:       { bg: "bg-[#3D6B5E]",   label: "Team" },
  specialist: { bg: "bg-[#5B4D7E]",   label: "Specialist" },
};

export default function CompanyCard({ company }: Props) {
  const config = company.values_type ? typeConfig[company.values_type] : { bg: "bg-[#CCCCC5]", label: "" };

  return (
    <Link href={`/companies/${company.id}`} className="group block">
      {/* サムネイル */}
      <div className={`relative w-full aspect-[4/3] overflow-hidden ${config.bg} mb-4`}>
        {company.photo_urls?.[0] ? (
          <Image
            src={company.photo_urls[0]}
            alt={company.company_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
            <p className="text-white/20 text-[80px] font-extrabold leading-none absolute top-2 right-3 select-none">
              {company.company_name.charAt(0)}
            </p>
            <p className="text-white/60 text-[10px] font-semibold tracking-[0.2em] uppercase relative z-10">
              {config.label}
            </p>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-full p-1.5">
            <ArrowUpRight size={14} className="text-[var(--color-text-primary)]" />
          </div>
        </div>
      </div>

      {/* テキスト */}
      <div>
        <p className="text-[10px] text-[var(--color-text-muted)] tracking-widest uppercase mb-1">
          {company.industry ?? "—"}
          {company.location && ` · ${company.location}`}
        </p>
        <h3 className="text-base font-bold text-[var(--color-text-primary)] leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors">
          {company.company_name}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
          {company.description}
        </p>
        {company.employee_count && (
          <p className="text-xs text-[var(--color-text-muted)] mt-2">{company.employee_count}名</p>
        )}
      </div>
    </Link>
  );
}
