import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CountUp from "@/components/ui/CountUp";

export const metadata: Metadata = {
  title: "Hataraku+淡路島 | 価値観で出会う採用プラットフォーム",
  description: "給与・条件だけでなく、価値観で企業と出会う。淡路島の企業文化・ビジョン・働く人の魅力を可視化した地域特化型採用プラットフォーム。移住・UIターン就職にも対応。",
  openGraph: {
    title: "Hataraku+淡路島 | 価値観で出会う採用プラットフォーム",
    description: "給与・条件だけでなく、価値観で企業と出会う。淡路島特化の採用プラットフォーム。",
    url: "/",
  },
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
      {/* ヒーロー */}
      <section className="min-h-[92vh] flex flex-col justify-between border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto w-full px-6 pt-16 pb-10 flex-1 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-12">
            <div className="flex-1">
              <p className="animate-fade-up-1 text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-8 md:mb-10">
                Awaji Island · Values-Based Recruitment Platform
              </p>
              <h1 className="animate-fade-up-2 text-[clamp(2.2rem,9vw,7.5rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--color-text-primary)]">
                条件だけで<br />
                なく、<br />
                <span className="text-[var(--color-accent)]">価値観</span>で<br />
                企業と出会う。
              </h1>
            </div>
            <div className="animate-fade-up-3 md:max-w-xs pb-2">
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8">
                企業文化・想い・働く人の魅力を可視化。淡路島で、自分らしい働き方を見つけてください。
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/diagnosis"
                  className="group inline-flex items-center justify-between px-6 py-4 rounded-xl bg-[var(--color-text-primary)] text-white text-sm font-semibold hover:bg-[var(--color-accent)] transition-colors duration-300"
                >
                  価値観診断をはじめる
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/companies"
                  className="inline-flex items-center justify-between px-6 py-4 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] transition-colors"
                >
                  企業を探す
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 数字 */}
        <div className="animate-fade-up-4 max-w-7xl mx-auto w-full px-6 pb-12">
          <div className="flex flex-wrap gap-8 sm:gap-12 md:gap-20">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)]">
                  <CountUp value={s.num} suffix={s.suffix} />
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* マーキー */}
      <div className="overflow-hidden border-b border-[var(--color-border)] py-4 bg-[var(--color-surface)]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 text-sm font-semibold text-[var(--color-text-muted)] tracking-widest uppercase">
              {["Awaji Island", "価値観マッチング", "UIターン就職", "淡路島採用", "Values Matching", "Working Culture", "企業文化の可視化", "淡路島で働く"].map((t) => (
                <span key={t} className="flex items-center gap-8">
                  {t}
                  <span className="text-[var(--color-accent)]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 特徴 */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)]">Why Hataraku+</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] md:max-w-sm leading-tight">
            他の求人サービスとは<br />ここが違います
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {features.map((f) => (
            <div key={f.title}>
              <div className="relative w-full aspect-[4/3] overflow-hidden mb-6">
                <Image src={f.image} alt={f.title} fill className="object-cover" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-brand)] text-white shrink-0">
                  <ArrowRight size={14} />
                </span>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{f.title}</h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 淡路島という選択 */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)]">Awaji Island</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] md:max-w-sm leading-tight">
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
            <blockquote className="text-[clamp(1.25rem,3vw,2rem)] font-bold leading-relaxed text-[var(--color-text-primary)] max-w-3xl">
              「淡路島は、<span className="text-[var(--color-accent)]">都市の便利さ</span>と<span className="text-[var(--color-accent)]">自然の豊かさ</span>が共存する、日本でも稀な島です。農業・観光・IT・食品加工など多様な産業が集まり、小さな島の中に大きなキャリアの選択肢があります。」
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-text-primary)]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)] mb-6">Free · 3 minutes</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              あなたの価値観を<br />知るところから。
            </h2>
          </div>
          <Link
            href="/diagnosis"
            className="group shrink-0 inline-flex items-center gap-3 px-8 py-5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-bold hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            価値観診断をはじめる（無料）
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>

</>
  );
}


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

const features = [
  {
    title: "価値観でマッチング",
    description: "給与・条件だけでなく、企業の文化・ビジョン・働く環境との相性を可視化します。",
    image: "https://picsum.photos/seed/hataraku-match/800/600",
  },
  {
    title: "淡路島特化",
    description: "地域に根ざした企業の魅力を深くご紹介。移住・UIターン就職にも対応。",
    image: "https://picsum.photos/seed/hataraku-awaji/800/600",
  },
  {
    title: "働く人の声",
    description: "企業インタビューや社員ストーリーを通じて、リアルな職場の雰囲気を伝えます。",
    image: "https://picsum.photos/seed/hataraku-people/800/600",
  },
];
