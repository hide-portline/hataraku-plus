"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArticleRow, CompanyRow } from "@/types/database";

type Article = ArticleRow & { companies: Pick<CompanyRow, "company_name"> | null };

const ACCENT_COLORS = [
  "bg-blue-100",
  "bg-amber-100",
  "bg-rose-100",
  "bg-emerald-100",
  "bg-violet-100",
];

export default function InterviewCarousel({ articles }: { articles: Article[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "right" ? 540 : -540, behavior: "smooth" });
  };

  if (articles.length === 0) return null;

  return (
    <section className="py-16 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                社員インタビュー
              </h2>
            </div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-text-muted)] ml-4">
              INTERVIEW
            </p>
          </div>
          <Link
            href="/articles?type=interview"
            className="flex items-center gap-3 bg-white border border-[var(--color-border)] rounded-full pl-5 pr-2 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:shadow-md transition-shadow"
          >
            人を知る
            <span className="w-8 h-8 rounded-full bg-[#E8331A] text-white flex items-center justify-center text-base leading-none">
              →
            </span>
          </Link>
        </div>

        {/* カルーセル */}
        <div className="relative">
          {/* 左矢印 */}
          <button
            onClick={() => scroll("left")}
            aria-label="前へ"
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-[var(--color-border)] shadow flex items-center justify-center text-lg hover:shadow-md transition-shadow"
          >
            ←
          </button>

          {/* カード列 */}
          <div
            ref={ref}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {articles.map((article, i) => {
              const accentBg = ACCENT_COLORS[i % ACCENT_COLORS.length];
              const photoSrc =
                article.thumbnail_url ??
                `https://picsum.photos/seed/${article.id}/300/420`;

              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group snap-start shrink-0 w-[480px] rounded-2xl bg-white border border-[var(--color-border)] shadow-sm overflow-hidden flex hover:shadow-md transition-shadow duration-200"
                >
                  {/* 左: テキスト */}
                  <div className="flex-1 p-7 flex flex-col justify-between min-w-0">
                    <div>
                      {/* カテゴリバッジ */}
                      <span className="inline-block border border-gray-800 rounded-full text-[11px] font-semibold px-3 py-1 mb-5">
                        {article.companies?.company_name ?? "インタビュー"}
                      </span>
                      {/* タイトル */}
                      <h3 className="text-[1.05rem] font-extrabold leading-snug text-[var(--color-text-primary)] line-clamp-4 group-hover:text-[#E8331A] transition-colors duration-150">
                        {article.title}
                      </h3>
                    </div>
                    {/* 矢印 */}
                    <div className="mt-6">
                      <span className="w-8 h-8 rounded-full bg-[#E8331A] text-white inline-flex items-center justify-center text-sm leading-none">
                        →
                      </span>
                    </div>
                  </div>

                  {/* 右: 写真 + アーチ背景 */}
                  <div className={`relative w-48 shrink-0 ${accentBg} overflow-hidden`}>
                    {/* アーチ形クリップ */}
                    <div className="absolute inset-x-0 bottom-0 top-8 rounded-tl-[60px] overflow-hidden">
                      <Image
                        src={photoSrc}
                        alt={article.title}
                        fill
                        className="object-cover object-top"
                        sizes="192px"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 右矢印 */}
          <button
            onClick={() => scroll("right")}
            aria-label="次へ"
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#E8331A] text-white shadow flex items-center justify-center text-lg hover:opacity-90 transition-opacity"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
