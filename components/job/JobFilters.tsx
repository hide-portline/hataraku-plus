"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const EMPLOYMENT_TYPES = [
  { value: "", label: "すべて" },
  { value: "fulltime", label: "正社員" },
  { value: "parttime", label: "パート" },
  { value: "contract", label: "契約社員" },
];

const WORK_STYLES = [
  { value: "", label: "すべて" },
  { value: "remote", label: "リモート" },
  { value: "onsite", label: "出社" },
  { value: "hybrid", label: "ハイブリッド" },
];

const VALUES_TYPES = [
  { value: "", label: "すべて" },
  { value: "challenger", label: "🔥 Challenger" },
  { value: "stable", label: "🏛 Stable" },
  { value: "team", label: "🤝 Team" },
  { value: "specialist", label: "🎯 Specialist" },
];

function FilterGroup({
  label,
  options,
  paramKey,
  current,
  onUpdate,
}: {
  label: string;
  options: { value: string; label: string }[];
  paramKey: string;
  current: string;
  onUpdate: (key: string, value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onUpdate(paramKey, opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              current === opt.value
                ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-brand)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const current = {
    employment_type: searchParams.get("employment_type") ?? "",
    work_style: searchParams.get("work_style") ?? "",
    values_type: searchParams.get("values_type") ?? "",
  };

  const isFiltered = Object.values(current).some(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5 mb-8 flex flex-col gap-4">
      <FilterGroup label="雇用形態" options={EMPLOYMENT_TYPES} paramKey="employment_type" current={current.employment_type} onUpdate={update} />
      <FilterGroup label="勤務スタイル" options={WORK_STYLES} paramKey="work_style" current={current.work_style} onUpdate={update} />
      <FilterGroup label="価値観タイプ" options={VALUES_TYPES} paramKey="values_type" current={current.values_type} onUpdate={update} />
      {isFiltered && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand)] underline self-start"
        >
          絞り込みをリセット
        </button>
      )}
    </div>
  );
}
