"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArticleType } from "@/types/database";

const ARTICLE_TYPE_LABEL: Record<string, string> = {
  story:     "ストーリー",
  interview: "社員インタビュー",
  news:      "ニュース",
};

type Article = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  article_type: ArticleType;
  companies: { company_name: string } | { company_name: string }[] | null;
};

export default function StoriesCarousel({ articles }: { articles: Article[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = () => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: 280, behavior: "smooth" });
  };

  return (
    <div className="flex-1 overflow-hidden relative">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const co = article.companies as any;
          const companyName: string | null = Array.isArray(co) ? co[0]?.company_name : co?.company_name ?? null;
          const typeLabel = ARTICLE_TYPE_LABEL[article.article_type] ?? article.article_type;

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

      {/* 右矢印 */}
      <button
        onClick={scroll}
        aria-label="次へ"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-accent)] text-white shadow-md flex items-center justify-center text-base hover:opacity-90 transition-opacity z-10"
      >
        →
      </button>
    </div>
  );
}
