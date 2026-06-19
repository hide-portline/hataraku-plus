"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12">
      <Link
        href={buildHref(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? "pointer-events-none text-[var(--color-text-muted)] opacity-40"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
        }`}
      >
        ← 前へ
      </Link>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[var(--color-text-muted)]">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-[var(--color-brand)] text-white"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildHref(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "pointer-events-none text-[var(--color-text-muted)] opacity-40"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
        }`}
      >
        次へ →
      </Link>
    </nav>
  );
}
