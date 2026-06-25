"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArticleRow, CompanyRow } from "@/types/database";

type Article = ArticleRow & { companies: Pick<CompanyRow, "company_name"> | null };

const ARC_COLORS = [
  "#dce8f5",
  "#f5e8dc",
  "#ddf5e8",
  "#f0dcf5",
  "#f5f5dc",
];

export default function InterviewCarousel({ articles }: { articles: Article[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "right" ? 520 : -520, behavior: "smooth" });
  };

  if (articles.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E8331A] inline-block shrink-0" />
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                社員インタビュー
              </h2>
            </div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-text-muted)] ml-4">
              INTERVIEW
            </p>
          </div>
          <Link
            href="/articles?type=interview"
            className="flex items-center gap-3 bg-white border border-[var(--color-border)] rounded-full pl-5 pr-2 py-2 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm hover:shadow transition-shadow"
          >
            人を知る
            <span className="w-8 h-8 rounded-full bg-[#E8331A] text-white flex items-center justify-center text-sm leading-none shrink-0">
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
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-border)] shadow-md flex items-center justify-center text-base hover:shadow-lg transition-shadow"
          >
            ←
          </button>

          {/* カード列 */}
          <div
            ref={ref}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {articles.map((article, i) => {
              const arcColor = ARC_COLORS[i % ARC_COLORS.length];
              const PORTRAITS = [
                "https://randomuser.me/api/portraits/women/44.jpg",
                "https://randomuser.me/api/portraits/men/32.jpg",
                "https://randomuser.me/api/portraits/men/55.jpg",
                "https://randomuser.me/api/portraits/women/68.jpg",
                "https://randomuser.me/api/portraits/men/41.jpg",
              ];
              const photoSrc =
                article.thumbnail_url ??
                PORTRAITS[i % PORTRAITS.length];

              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group snap-start shrink-0 w-[480px] h-[300px] rounded-2xl bg-white border border-[var(--color-border)] shadow-sm overflow-hidden flex hover:shadow-md transition-shadow duration-200"
                >
                  {/* 左: テキストエリア */}
                  <div className="flex flex-col justify-between p-8 flex-1 min-w-0">
                    {/* 上部 */}
                    <div className="flex flex-col gap-5">
                      {/* 役職バッジ */}
                      <span className="inline-flex self-start border border-gray-700 rounded-full text-[11px] font-semibold px-3.5 py-1 text-[var(--color-text-primary)] whitespace-nowrap">
                        {article.interviewee_role ?? article.companies?.company_name ?? "インタビュー"}
                      </span>
                      {/* タイトル */}
                      <h3 className="text-[1rem] font-extrabold leading-snug text-[var(--color-text-primary)] line-clamp-4">
                        {article.title}
                      </h3>
                    </div>
                    {/* 下部: 名前 + 企業名 + 矢印 */}
                    <div className="flex flex-col gap-3">
                      <div>
                        {article.interviewee_name && (
                          <p className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide">
                            {article.interviewee_name}
                          </p>
                        )}
                        {article.companies?.company_name && (
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                            {article.companies.company_name}
                          </p>
                        )}
                      </div>
                      <span className="w-8 h-8 rounded-full bg-[#E8331A] text-white inline-flex items-center justify-center text-sm leading-none">
                        →
                      </span>
                    </div>
                  </div>

                  {/* 右: アーチ背景 + 写真 */}
                  <div className="relative w-[200px] shrink-0 overflow-hidden">
                    {/* アーチ形の色背景 */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: arcColor,
                        borderTopLeftRadius: "120px",
                      }}
                    />
                    {/* 人物写真 */}
                    <div className="absolute inset-0" style={{ borderTopLeftRadius: "120px", overflow: "hidden" }}>
                      <Image
                        src={photoSrc}
                        alt={article.interviewee_name ?? article.title}
                        fill
                        className="object-cover object-top"
                        sizes="200px"
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
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#E8331A] text-white shadow-md flex items-center justify-center text-base hover:opacity-90 transition-opacity"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
