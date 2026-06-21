"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { X, Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/companies", label: "企業を探す" },
  { href: "/articles", label: "ストーリー" },
  { href: "/diagnosis", label: "価値観診断" },
  { href: "/companies", label: "エリアから探す" },
  { href: "/jobs", label: "掲載企業一覧" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="shrink-0" onClick={() => setMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt="Hataraku+ 淡路島"
              width={120}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* デスクトップナビ */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-[var(--color-text-primary)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* 右側アクション（デスクトップ） */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white px-4 py-2 rounded-full transition-colors"
            >
              会員登録
            </Link>
          </div>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--color-text-primary)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* モバイルドロワー（フルスクリーン） */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* 背景オーバーレイ */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
        {/* ドロワー本体 */}
        <div
          className={`absolute top-16 left-0 right-0 bg-white border-b border-[var(--color-border)] transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          <nav className="px-6 py-6 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-base font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 pb-6 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-primary)] text-center hover:border-[var(--color-text-primary)] transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-white text-sm font-bold text-center hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              会員登録
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
