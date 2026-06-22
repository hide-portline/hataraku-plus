import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { ValuesType, ArticleType } from "@/types/database";

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

const ICON_SRC: Record<ValuesType, string> = {
  challenger: "/icons/challenger.png",
  stable:     "/icons/stable.jpg",
  team:       "/icons/team.png",
  specialist: "/icons/explorer.png",
};

const TYPE_SHORT: Record<ValuesType, string> = {
  challenger: "挑戦型",
  stable:     "安定型",
  team:       "協調型",
  specialist: "探究型",
};

const TYPE_DESC: Record<ValuesType, string> = {
  challenger: "新しいことに挑戦し、成長と変化を楽しめる人。",
  stable:     "安定した環境で、コツコツと成果を積み上げていける人。",
  team:       "人とのつながりやチームでの協力を大切にできる人。",
  specialist: "専門性を高め、物事を深く探究することが好きな人。",
};

const TYPE_BADGE: Record<ValuesType, string> = {
  challenger: "bg-orange-100 text-orange-700",
  stable:     "bg-emerald-100 text-emerald-700",
  team:       "bg-sky-100 text-sky-700",
  specialist: "bg-violet-100 text-violet-700",
};

const ARTICLE_TYPE_LABEL: Record<ArticleType, string> = {
  interview: "社員インタビュー",
  story:     "ストーリー",
  news:      "ニュース",
};

const REGION_CITIES: Record<string, string> = {
  "淡路市":    "岩屋・北淡・東浦・津名・一宮",
  "洲本市":    "洲本・由良・五色",
  "南あわじ市": "広田・緑・西淡・三原・南淡・沼島",
};

const REGION_IMG: Record<string, string> = {
  "淡路市":    "https://picsum.photos/seed/awaji-north/800/500",
  "洲本市":    "https://picsum.photos/seed/sumoto-city/800/500",
  "南あわじ市": "https://picsum.photos/seed/minami-awaji/800/500",
};

export default async function TopPage() {
  const supabase = await createClient();

  const [{ data: articles }, { data: companies }, { data: regions }] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, thumbnail_url, article_type, companies(company_name)")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(5),
    supabase
      .from("companies")
      .select("id, company_name, logo_url, photo_urls, values_type, regions(name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("regions")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("display_order")
      .limit(3),
  ]);

  return (
    <>
      {/* ━━━━ HERO ━━━━ */}
      <section className="relative min-h-screen flex overflow-hidden">
        {/* 右側：写真 */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="淡路島で働く"
            fill
            className="object-cover object-center animate-hero-drift"
            priority
          />
        </div>

        {/* 左側：白パネル */}
        <div className="relative z-10 bg-white w-full md:w-[48%] min-h-screen flex flex-col justify-center pb-16 pt-32 overflow-visible">
          <div className="pl-12 md:pl-16 pr-4">
            {/* 小さいタグライン */}
            <p className="text-[var(--color-text-secondary)] text-3xl font-medium tracking-wide mb-5">
              出会いから、働く。
            </p>

            {/* 大きい見出し3行 */}
            <h1 className="font-hero text-[var(--color-text-primary)] mb-10 whitespace-nowrap" style={{ lineHeight: "0.85" }}>
              <span className="block" style={{ fontSize: "clamp(3rem,9.5vw,8.5rem)" }}>Hata</span>
              <span className="block" style={{ fontSize: "clamp(3rem,9.5vw,8.5rem)" }}>raku+</span>
              <span className="block" style={{ fontSize: "clamp(3rem,9.5vw,8.5rem)" }}>淡路島</span>
            </h1>

            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-xs">
              求人票だけでは、出会えない企業がある。<br />
              企業文化、働く人、価値観で出会おう。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold hover:bg-[var(--color-accent-dark)] transition-colors"
              >
                価値観診断をはじめる <ArrowRight size={14} />
              </Link>
              <Link
                href="/companies"
                className="inline-flex items-center px-7 py-3.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                企業を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━ VALUE TYPES ━━━━ */}
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            <div className="md:w-64 shrink-0">
              <p className="text-[var(--color-accent)] text-xs font-bold mb-3">3分で分かる</p>
              <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)] leading-snug mb-4">
                あなたはどんな<br />働き方を求めていますか？
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                価値観診断で、あなたのタイプを見つけましょう。あなたに合った企業との出会いをサポートします。
              </p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {VALUE_TYPES.map((type) => (
                  <div
                    key={type}
                    className="border border-[var(--color-border)] rounded-2xl p-5 text-center flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-14 h-14">
                      <Image src={ICON_SRC[type]} alt={type} fill style={{ objectFit: "contain" }} />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-[var(--color-text-primary)] mb-1">
                        {TYPE_SHORT[type]}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {TYPE_DESC[type]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/diagnosis"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-text-primary)] text-white text-sm font-bold hover:opacity-80 transition-opacity"
                >
                  3分で診断する <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━ STORIES ━━━━ */}
      {articles && articles.length > 0 && (
        <section className="border-b border-[var(--color-border)] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">
              <div className="md:w-56 shrink-0">
                <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] leading-snug mb-4">
                  働く人のストーリーから<br />企業を知る
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  実際に働く人の想いや、仕事にかける情熱。ストーリーを通じて、企業のリアルな魅力に触れてみましょう。
                </p>
                <Link
                  href="/articles"
                  className="text-sm font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  すべてのストーリーを見る →
                </Link>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch]">
                  {articles.map((article) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const co = article.companies as any;
                    const companyName: string | null = Array.isArray(co) ? co[0]?.company_name : co?.company_name ?? null;
                    const typeLabel = ARTICLE_TYPE_LABEL[article.article_type as ArticleType] ?? article.article_type;
                    return (
                      <Link
                        key={article.id}
                        href={`/articles/${article.id}`}
                        className="relative shrink-0 w-52 md:w-60 rounded-2xl overflow-hidden snap-start"
                      >
                        <div className="relative aspect-[3/4]">
                          {article.thumbnail_url ? (
                            <Image src={article.thumbnail_url} alt={article.title} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 bg-gray-300" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                          <span className="self-start text-[10px] font-bold bg-white/90 text-[var(--color-text-primary)] px-2.5 py-1 rounded-full">
                            {typeLabel}
                          </span>
                          <div>
                            <p className="text-white font-extrabold text-sm leading-snug mb-1.5 line-clamp-3">
                              {article.title}
                            </p>
                            {companyName && (
                              <p className="text-white/60 text-xs">{companyName}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ━━━━ FEATURED COMPANIES ━━━━ */}
      {companies && companies.length > 0 && (
        <section className="border-b border-[var(--color-border)] py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">淡路島の注目企業</h2>
              <Link
                href="/companies"
                className="text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
              >
                すべての企業を見る →
              </Link>
            </div>
          </div>
          {/* 無限スクロール: 2セット並べてループ */}
          <div className="flex animate-marquee-slow gap-5 w-max">
            {[...companies, ...companies].map((company, i) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const r = company.regions as any;
              const regionName: string | null = Array.isArray(r) ? r[0]?.name : r?.name ?? null;
              const photo = company.photo_urls?.[0] ?? `https://picsum.photos/seed/co-${company.id.slice(0, 8)}/400/300`;
              const vt = company.values_type as ValuesType | null;
              return (
                <Link
                  key={`${company.id}-${i}`}
                  href={`/companies/${company.id}`}
                  className="relative shrink-0 w-60 rounded-2xl overflow-hidden group"
                >
                  <div className="relative w-60 h-40">
                    <Image src={photo} alt={company.company_name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {vt && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${TYPE_BADGE[vt]}`}>
                        {TYPE_SHORT[vt]}
                      </span>
                    )}
                    <p className="text-white font-extrabold text-sm leading-snug">{company.company_name}</p>
                    {regionName && <p className="text-white/60 text-xs mt-0.5">{regionName}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ━━━━ REGIONS ━━━━ */}
      {regions && regions.length > 0 && (
        <section className="border-b border-[var(--color-border)] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">エリアから企業と出会う</h2>
              <Link
                href="/companies"
                className="text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
              >
                エリアについて詳しく見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {regions.map((region) => (
                <Link
                  key={region.id}
                  href={`/companies?region=${region.slug}`}
                  className="relative aspect-video rounded-2xl overflow-hidden group"
                >
                  <Image
                    src={REGION_IMG[region.name] ?? `https://picsum.photos/seed/${region.slug}/800/500`}
                    alt={region.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-white font-extrabold text-lg">{region.name}</p>
                    <p className="text-white/60 text-xs mt-1">{REGION_CITIES[region.name] ?? ""}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━ CTA ━━━━ */}
      <section className="bg-[#1a2340]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug mb-3">
                あなたに合う企業と、<br />出会いませんか？
              </h2>
              <p className="text-white/60 text-sm">価値観から、あなたに合う企業を見つけましょう。</p>
            </div>
            <Link
              href="/diagnosis"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              価値観診断をはじめる <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
