import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "記事・ストーリー",
  description: "淡路島で働く人たちのストーリー。企業インタビューや移住体験談を通じて、リアルな職場の雰囲気をお届けします。",
  openGraph: {
    title: "記事・ストーリー | Hataraku+淡路島",
    description: "淡路島で働く人たちのリアルなストーリー。",
    url: "/articles",
  },
};

export const revalidate = 3600;

export default async function ArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*, companies(company_name)")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const featured = articles?.[0];
  const rest = articles?.slice(1) ?? [];

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-text-muted)] mb-4">
            Stories
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.9] tracking-tight text-[var(--color-text-primary)]">
              淡路島の<br />ストーリー
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed">
              企業の文化、移住者のリアル、<br />島で働くことの魅力を伝えます。
            </p>
          </div>
        </div>
      </div>

      {!articles || articles.length === 0 ? (
        <div className="text-center py-32 text-[var(--color-text-muted)]">
          <p className="text-sm font-semibold">記事を準備中です</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* フィーチャー記事 */}
          {featured && (
            <Link href={`/articles/${featured.id}`} className="group block mb-16">
              <article className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="aspect-[4/3] md:aspect-auto md:h-[480px] bg-[var(--color-surface)] rounded-2xl overflow-hidden relative">
                  {featured.thumbnail_url ? (
                    <Image
                      src={featured.thumbnail_url}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--color-text-primary)] text-white/20 text-8xl font-extrabold">
                      S
                    </div>
                  )}
                </div>
                <div className="py-4">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-brand)] mb-4">
                    Featured
                  </p>
                  {featured.companies?.company_name && (
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">
                      {featured.companies.company_name}
                    </p>
                  )}
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] leading-snug mb-4 group-hover:text-[var(--color-brand)] transition-colors">
                    {featured.title}
                  </h2>
                  {featured.published_at && (
                    <p className="text-xs text-[var(--color-text-muted)]">{formatDate(featured.published_at)}</p>
                  )}
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                    読む
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* 残り記事グリッド */}
          {rest.length > 0 && (
            <>
              <div className="border-t border-[var(--color-border)] pt-12">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {rest.map((a) => (
                    <Link key={a.id} href={`/articles/${a.id}`} className="group">
                      <article>
                        <div className="aspect-[4/3] bg-[var(--color-surface)] rounded-xl overflow-hidden relative mb-4">
                          {a.thumbnail_url ? (
                            <Image
                              src={a.thumbnail_url}
                              alt={a.title}
                              fill
                              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-[var(--color-border)]" />
                          )}
                        </div>
                        {a.companies?.company_name && (
                          <p className="text-xs text-[var(--color-brand)] font-semibold mb-1">
                            {a.companies.company_name}
                          </p>
                        )}
                        <h2 className="font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors leading-snug mb-2 line-clamp-2">
                          {a.title}
                        </h2>
                        {a.published_at && (
                          <p className="text-xs text-[var(--color-text-muted)]">{formatDate(a.published_at)}</p>
                        )}
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
