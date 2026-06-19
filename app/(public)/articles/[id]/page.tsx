import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, content, thumbnail_url, companies(company_name)")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!article) return { title: "記事" };
  const companyName = Array.isArray(article.companies) ? article.companies[0]?.company_name : (article.companies as { company_name: string } | null)?.company_name;
  return {
    title: article.title,
    description: (article.content as string)?.slice(0, 120) ?? `${companyName ?? ""}のストーリー。`,
    openGraph: {
      title: `${article.title} | Hataraku+淡路島`,
      description: (article.content as string)?.slice(0, 120) ?? `${companyName ?? ""}のストーリー。`,
      url: `/articles/${id}`,
      ...(article.thumbnail_url ? { images: [{ url: article.thumbnail_url }] } : {}),
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*, companies(id, company_name, logo_url)")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!article) notFound();
  const company = Array.isArray(article.companies) ? article.companies[0] : article.companies;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/articles" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] mb-6 inline-block">
        ← 記事一覧へ
      </Link>

      {article.thumbnail_url && (
        <div className="aspect-video relative rounded-2xl overflow-hidden mb-8">
          <Image src={article.thumbnail_url} alt={article.title} fill className="object-cover" />
        </div>
      )}

      <div className="mb-6">
        {company && (
          <Link href={`/companies/${company.id}`} className="flex items-center gap-2 mb-4 group w-fit">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
              {company.logo_url ? (
                <Image src={company.logo_url} alt={company.company_name} width={32} height={32} className="object-contain" />
              ) : (
                <span className="text-xs font-bold text-[var(--color-brand)]">{company.company_name.charAt(0)}</span>
              )}
            </div>
            <span className="text-sm font-semibold text-[var(--color-brand)] group-hover:underline">{company.company_name}</span>
          </Link>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-3 leading-tight">
          {article.title}
        </h1>
        {article.published_at && (
          <p className="text-sm text-[var(--color-text-muted)]">{formatDate(article.published_at)}</p>
        )}
      </div>

      <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed">
        <p className="whitespace-pre-line">{article.content}</p>
      </div>

      {company && (
        <div className="mt-12 p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">この記事を書いた企業</p>
          <p className="font-bold text-[var(--color-text-primary)] mb-3">{company.company_name}</p>
          <Link href={`/companies/${company.id}`} className="text-sm text-[var(--color-brand)] font-semibold hover:underline">
            企業詳細を見る →
          </Link>
        </div>
      )}
    </div>
  );
}
