import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CountUp from "@/components/ui/CountUp";
import NeonTypeIcon from "@/components/ui/NeonTypeIcon";
import {
  VALUES_TYPE_LABELS,
  VALUES_TYPE_DESCRIPTIONS,
} from "@/lib/utils/diagnosis";
import type { ValuesType } from "@/types/database";

export const metadata: Metadata = {
  title: "Hataraku+淡路島 | 価値観で出会う採用プラットフォーム",
  description: "給与・条件だけでなく、価値観で企業と出会う。淡路島の企業文化・ビジョン・働く人の魅力を可視化した地域特化型採用プラットフォーム。移住・UIターン就職にも対応。",
  openGraph: {
    title: "Hataraku+淡路島 | 価値観で出会う採用プラットフォーム",
    description: "給与・条件だけでなく、価値観で企業と出会う。淡路島特化の採用プラットフォーム。",
    url: "/",
  },
};

const VALUE_TYPES: ValuesType[] = ["challenger", "stable", "team", "specialist"];

const TYPE_ACCENT: Record<ValuesType, string> = {
  challenger: "text-[#FF7A00]",
  stable:     "text-emerald-400",
  team:       "text-sky-400",
  specialist: "text-violet-400",
};

export default async function TopPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).rpc("get_platform_stats").single();
  const stats = [
    { num: Number(data?.company_count ?? 0), suffix: "社", label: "登録企業数" },
    { num: Number(data?.user_count ?? 0), suffix: "名", label: "登録ユーザー数" },
    { num: Number(data?.job_count ?? 0), suffix: "件", label: "求人掲載数" },
  ];

  return (
    <>
      {/* ━━━━━━ HERO ━━━━━━ */}
      <section className="relative min-h-[96vh] flex flex-col border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto w-full px-6 pt-20 pb-0 flex-1 flex flex-col">
          <p className="animate-fade-up-1 text-[10px] font-bold tracking-[0.35em] uppercase text-[var(--color-text-muted)] mb-12">
            Awaji Island · Values-Based Recruitment
          </p>
          <div className="flex-1 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <h1 className="animate-fade-up-2 text-[clamp(3rem,11vw,9rem)] font-extrabold leading-[0.88] tracking-tighter text-[var(--color-text-primary)]">
              価値観で、<br />
              働く場所を<br />
              <em className="not-italic text-[var(--color-accent)]">選ぶ。</em>
            </h1>
            <div className="animate-fade-up-3 shrink-0 md:max-w-xs pb-12">
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8">
                給与・条件だけでなく、企業文化との相性で出会う。<br />
                淡路島の採用が、変わります。
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/diagnosis"
                  className="group inline-flex items-center justify-between px-6 py-4 rounded-xl bg-[var(--color-text-primary)] text-[var(--color-surface)] text-sm font-bold hover:bg-[var(--color-accent)] transition-colors duration-300"
                >
                  価値観診断をはじめる（無料）
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/companies"
                  className="group inline-flex items-center justify-between px-6 py-4 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] transition-colors"
                >
                  企業を探す
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* stats bar */}
        <div className="animate-fade-up-4 border-t border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto w-full px-6 py-5 flex flex-wrap gap-x-12 gap-y-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[var(--color-text-primary)]">
                  <CountUp value={s.num} suffix={s.suffix} />
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ MARQUEE ━━━━━━ */}
      <div className="overflow-hidden border-b border-[var(--color-border)] py-3.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 text-[11px] font-bold text-[var(--color-text-muted)] tracking-[0.2em] uppercase">
              {["Awaji Island", "価値観マッチング", "UIターン就職", "淡路島採用", "Values Matching", "Working Culture", "企業文化の可視化", "淡路島で働く"].map((t) => (
                <span key={t} className="flex items-center gap-8">
                  {t}<span className="text-[var(--color-accent)]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ━━━━━━ HOW IT WORKS ━━━━━━ */}
      <section className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[var(--color-text-muted)]">How it works</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] leading-tight">
              3ステップで、あなたに合う<br className="hidden md:block" />企業と出会えます。
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)]">
            {steps.map((step, i) => (
              <div key={i} className="bg-[var(--color-surface)] p-8 md:p-10">
                <p className="text-[4.5rem] font-extrabold leading-none text-[var(--color-text-primary)] opacity-[0.07] mb-6 select-none tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base font-extrabold text-[var(--color-text-primary)] mb-3">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/diagnosis"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              診断を試してみる
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━ 4 VALUE TYPES ━━━━━━ */}
      <section className="border-b border-[var(--color-border)] bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-white/30">4 Values Types</p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              あなたはどのタイプ？
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {VALUE_TYPES.map((type) => (
              <div key={type} className="flex flex-col items-center text-center gap-5">
                <NeonTypeIcon type={type} size="md" />
                <div>
                  <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 ${TYPE_ACCENT[type]}`}>
                    {type}
                  </p>
                  <p className="text-sm font-extrabold text-white leading-snug">
                    {VALUES_TYPE_LABELS[type].split("（")[0]}
                  </p>
                  <p className="text-xs text-white/40 mt-2 leading-relaxed hidden md:block">
                    {VALUES_TYPE_DESCRIPTIONS[type]}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-12 border-t border-white/10 flex justify-center">
            <Link
              href="/diagnosis"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black text-sm font-bold hover:bg-[var(--color-accent)] hover:text-white transition-colors duration-300"
            >
              診断して自分のタイプを知る
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━ WHY HATARAKU+ ━━━━━━ */}
      <section className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[var(--color-text-muted)]">Why Hataraku+</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] leading-tight">
              他の求人サービスと、<br />ここが違います。
            </h2>
          </div>
          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-8 md:py-10">
                <p className="text-[3.5rem] font-extrabold leading-none text-[var(--color-text-primary)] opacity-[0.07] shrink-0 w-20 select-none tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="flex-1">
                  <h3 className="text-base font-extrabold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xl">{f.description}</p>
                </div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)] shrink-0 hidden md:block">
                  {f.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━ AWAJI ISLAND ━━━━━━ */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[var(--color-text-muted)]">Awaji Island</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] leading-tight">
              なぜ、淡路島で<br />働くのか。
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)]">
            {awajiFacts.map((fact) => (
              <div key={fact.label} className="bg-[var(--color-surface)] p-8 md:p-10">
                <p className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none text-[var(--color-text-primary)] mb-4">
                  {fact.value}
                </p>
                <p className="text-sm font-bold text-[var(--color-text-primary)] mb-2">{fact.label}</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{fact.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 border-t border-[var(--color-border)] pt-12">
            <blockquote className="text-[clamp(1.1rem,2.5vw,1.75rem)] font-bold leading-relaxed text-[var(--color-text-primary)] max-w-3xl">
              「淡路島は、<span className="text-[var(--color-accent)]">都市の便利さ</span>と
              <span className="text-[var(--color-accent)]">自然の豊かさ</span>が共存する、日本でも稀な島。農業・観光・IT・食品加工など多様な産業が集まり、小さな島の中に大きなキャリアの選択肢があります。」
            </blockquote>
          </div>
        </div>
      </section>

      {/* ━━━━━━ CTA ━━━━━━ */}
      <section className="bg-[var(--color-text-primary)]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[var(--color-accent)] mb-8">Free · 3 minutes</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-extrabold text-white leading-[0.95] tracking-tight">
              まず、自分の<br />価値観を知る。
            </h2>
            <Link
              href="/diagnosis"
              className="group shrink-0 inline-flex items-center gap-3 px-8 py-5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-bold hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              価値観診断をはじめる（無料）
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const steps = [
  {
    title: "価値観診断（20問）",
    description: "仕事に対する考え方や価値観に関する20の質問に答えるだけ。所要時間は約3分です。",
  },
  {
    title: "あなたのタイプが分かる",
    description: "挑戦型・安定型・協調型・探究型の4タイプから、あなたの価値観タイプが判明します。",
  },
  {
    title: "マッチした企業と出会う",
    description: "あなたのタイプに合った淡路島の企業が表示されます。マッチ度スコアで比較できます。",
  },
];

const features = [
  {
    title: "価値観でマッチング",
    description: "給与・条件だけでなく、企業の文化・ビジョン・働く環境との相性を可視化。「なんか違う」を減らします。",
    en: "Values Matching",
  },
  {
    title: "淡路島特化の情報量",
    description: "地域に根ざした企業の実態を深くご紹介。移住・UIターン就職サポートも充実しています。",
    en: "Local Expertise",
  },
  {
    title: "企業文化の可視化",
    description: "「社風」という曖昧な言葉を、診断スコアで数値化。企業ごとの価値観タイプが一目で分かります。",
    en: "Culture Visibility",
  },
];

const awajiFacts = [
  {
    value: "45分",
    label: "神戸から淡路島へ",
    description: "明石海峡大橋を渡れば神戸まで約45分。大阪まで約1時間。都市へのアクセスを保ちながら、島の自然の中で暮らせます。",
  },
  {
    value: "4業種",
    label: "農業・観光・IT・食品",
    description: "農業・漁業・観光・食品加工・IT・製造業まで、多様な産業が淡路島という小さな島に共存しています。",
  },
  {
    value: "増加中",
    label: "移住者・UIターン就職",
    description: "UIターン就職を歓迎する企業が多く、移住者支援制度も充実。新しいキャリアと新しい暮らしを同時に始められます。",
  },
];
