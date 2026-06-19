"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const VALUES_TYPES = [
  { value: "", label: "すべて" },
  { value: "challenger", label: "🔥 Challenger" },
  { value: "stable", label: "🏛 Stable" },
  { value: "team", label: "🤝 Team" },
  { value: "specialist", label: "🎯 Specialist" },
];

export default function CompanyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("values_type") ?? "";

  const update = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("values_type", value);
    } else {
      params.delete("values_type");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {VALUES_TYPES.map((opt) => (
        <button
          key={opt.value}
          onClick={() => update(opt.value)}
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
  );
}
