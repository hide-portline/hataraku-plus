import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";

export const revalidate = 3600;

export default async function ArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*, companies(company_name)")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">ストーリー</h1>
        <p className="text-[var(--color-text-secondary)]">
          企業の文化・想い・働く人のリアルを伝えます。
        </p>
      </div>

      {!articles || articles.length === 0 ? (
        <div className="text-center py-24 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-4">📖</p>
          <p className="font-semibold">記事を準備中です</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link key={a.id} href={`/articles/${a.id}`} className="group">
              <article className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
                <div className="aspect-video bg-[var(--color-surface)] relative overflow-hidden">
                  {a.thumbnail_url ? (
                    <Image src={a.thumbnail_url} alt={a.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                  )}
                </div>
                <div className="p-5">
                  {a.companies && (
                    <p className="text-xs text-[var(--color-brand)] font-semibold mb-1">
                      {Array.isArray(a.companies) ? a.companies[0]?.company_name : (a.companies as { company_name: string }).company_name}
                    </p>
                  )}
                  <h2 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors leading-snug mb-2 line-clamp-2">
                    {a.title}
                  </h2>
                  {a.published_at && (
                    <p className="text-xs text-[var(--color-text-muted)]">{formatDate(a.published_at)}</p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
