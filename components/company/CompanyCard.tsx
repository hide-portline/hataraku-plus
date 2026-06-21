import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { CompanyRow, ValuesType } from "@/types/database";

type Props = {
  company: CompanyRow & { regions?: { name: string } | null };
};

const TYPE_BADGE: Record<ValuesType, { label: string; bg: string; fallbackBg: string }> = {
  challenger: { label: "挑戦型", bg: "bg-orange-500 text-white",  fallbackBg: "bg-orange-400"  },
  stable:     { label: "安定型", bg: "bg-emerald-600 text-white", fallbackBg: "bg-emerald-500" },
  team:       { label: "協調型", bg: "bg-sky-500 text-white",     fallbackBg: "bg-sky-500"     },
  specialist: { label: "探究型", bg: "bg-violet-600 text-white",  fallbackBg: "bg-violet-500"  },
};

export default function CompanyCard({ company }: Props) {
  const vt = company.values_type as ValuesType | null;
  const badge = vt ? TYPE_BADGE[vt] : null;
  const fallbackBg = badge?.fallbackBg ?? "bg-gray-400";
  const regionName = company.regions?.name ?? null;

  return (
    <Link href={`/companies/${company.id}`} className="group block">
      {/* 写真エリア */}
      <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 ${fallbackBg}`}>
        {company.photo_urls?.[0] ? (
          <Image
            src={company.photo_urls[0]}
            alt={company.company_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <p className="absolute top-2 right-3 text-white/20 text-[80px] font-extrabold leading-none select-none">
            {company.company_name.charAt(0)}
          </p>
        )}
        {badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${badge.bg}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* テキスト */}
      <h3 className="text-base font-extrabold text-[var(--color-text-primary)] leading-snug mb-1.5 group-hover:text-[var(--color-accent)] transition-colors">
        {company.company_name}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 mb-3">
        {company.description}
      </p>
      <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        {regionName && (
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {regionName}
          </span>
        )}
        {company.employee_count && (
          <span>{company.employee_count}名</span>
        )}
      </div>
    </Link>
  );
}
