import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function TopPage() {
  return (
    <>
      {/* ヒーロー */}
      <section className="min-h-[92vh] flex flex-col justify-between border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto w-full px-6 pt-16 pb-10 flex-1 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-10">
                Awaji Island · Values-Based Recruitment Platform
              </p>
              <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--color-text-primary)]">
                条件だけで<br />
                なく、<br />
                <span className="text-[var(--color-accent)]">価値観</span>で<br />
                企業と出会う。
              </h1>
            </div>
            <div className="md:max-w-xs pb-2">
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
        <div className="max-w-7xl mx-auto w-full px-6 pb-12">
          <div className="flex gap-12 md:gap-20">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)]">{s.value}</p>
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
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-text-muted)]">Why HATARAKU+</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] md:max-w-sm leading-tight">
            他の求人サービスとは<br />ここが違います
          </h2>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)] border border-[var(--color-border)]">
          {features.map((f, i) => (
            <div key={f.title} className="p-8 md:p-10">
              <p className="text-xs font-mono text-[var(--color-accent)] mb-8">0{i + 1}</p>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">{f.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.description}</p>
            </div>
          ))}
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

const stats = [
  { value: "50+", label: "掲載企業" },
  { value: "4種", label: "価値観タイプ" },
  { value: "3分", label: "診断所要時間" },
];

const features = [
  {
    title: "価値観でマッチング",
    description: "給与・条件だけでなく、企業の文化・ビジョン・働く環境との相性を可視化します。",
  },
  {
    title: "淡路島特化",
    description: "地域に根ざした企業の魅力を深くご紹介。移住・UIターン就職にも対応。",
  },
  {
    title: "働く人の声",
    description: "企業インタビューや社員ストーリーを通じて、リアルな職場の雰囲気を伝えます。",
  },
];
