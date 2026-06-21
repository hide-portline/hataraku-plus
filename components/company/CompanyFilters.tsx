"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const POPULAR_KEYWORDS = [
  "若手が活躍", "地域密着", "チャレンジできる", "スキルが身につく", "ワークライフバランス", "安定して働ける",
];

const VALUES_TYPES = [
  { value: "", label: "すべて" },
  { value: "challenger", label: "挑戦型" },
  { value: "stable",     label: "安定型" },
  { value: "team",       label: "協調型" },
  { value: "specialist", label: "探究型" },
];

const TYPE_ACTIVE: Record<string, string> = {
  challenger: "bg-orange-500 text-white border-transparent",
  stable:     "bg-emerald-600 text-white border-transparent",
  team:       "bg-sky-500 text-white border-transparent",
  specialist: "bg-violet-600 text-white border-transparent",
};

type Region = { id: string; name: string; slug: string };

type Props = {
  regions: Region[];
  industries: string[];
  typeCounts: Record<string, number>;
  totalCount: number;
};

export default function CompanyFilters({ regions, industries, typeCounts, totalCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType    = searchParams.get("values_type") ?? "";
  const currentRegion  = searchParams.get("region") ?? "";
  const currentIndustry = searchParams.get("industry") ?? "";
  const currentQ       = searchParams.get("q") ?? "";

  const [q, setQ] = useState(currentQ);

  const update = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = () => update({ q });

  return (
    <div className="mb-10">
      {/* 検索ボックス */}
      <div className="border border-[var(--color-border)] rounded-2xl p-5 md:p-6 mb-5 bg-white">
        <div className="flex flex-col md:flex-row gap-3">
          {/* エリア */}
          <select
            value={currentRegion}
            onChange={(e) => update({ region: e.target.value })}
            className="flex-1 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] bg-white focus:outline-none focus:border-[var(--color-brand)] cursor-pointer"
          >
            <option value="">すべてのエリア</option>
            {regions.map((r) => (
              <option key={r.id} value={r.slug}>{r.name}</option>
            ))}
          </select>

          {/* 業種 */}
          <select
            value={currentIndustry}
            onChange={(e) => update({ industry: e.target.value })}
            className="flex-1 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] bg-white focus:outline-none focus:border-[var(--color-brand)] cursor-pointer"
          >
            <option value="">すべての業種</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          {/* フリーワード + 検索ボタン */}
          <div className="flex-[2] flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="text"
                placeholder="企業名・キーワードなど"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl bg-[var(--color-text-primary)] text-white text-sm font-bold hover:opacity-80 transition-opacity shrink-0"
            >
              検索する
            </button>
          </div>
        </div>

        {/* 人気キーワード */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)] font-medium shrink-0">人気のキーワード</span>
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => { setQ(kw); update({ q: kw }); }}
              className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1 rounded-full hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
            >
              #{kw}
            </button>
          ))}
        </div>
      </div>

      {/* タイプタブ */}
      <div className="flex flex-wrap items-center gap-2">
        {VALUES_TYPES.map((opt) => {
          const cnt = opt.value ? (typeCounts[opt.value] ?? 0) : totalCount;
          const isActive = currentType === opt.value;
          const activeClass = isActive
            ? opt.value
              ? TYPE_ACTIVE[opt.value]
              : "bg-[var(--color-text-primary)] text-white border-transparent"
            : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-primary)]";
          return (
            <button
              key={opt.value}
              onClick={() => update({ values_type: opt.value })}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition-all ${activeClass}`}
            >
              {opt.label}
              <span className={`text-xs ${isActive ? "opacity-60" : "text-[var(--color-text-muted)]"}`}>
                ({cnt})
              </span>
            </button>
          );
        })}
        <div className="ml-auto hidden md:flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span className="font-medium">並び替え</span>
          <select className="border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-primary)] bg-white focus:outline-none">
            <option>おすすめ順</option>
            <option>新着順</option>
          </select>
        </div>
      </div>
    </div>
  );
}
