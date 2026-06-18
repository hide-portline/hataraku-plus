"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Hataraku+ 淡路島"
            width={120}
            height={48}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
          <Link href="/companies" className="hover:text-[var(--color-brand)] transition-colors">
            企業を探す
          </Link>
          <Link href="/jobs" className="hover:text-[var(--color-brand)] transition-colors">
            求人を見る
          </Link>
          <Link href="/articles" className="hover:text-[var(--color-brand)] transition-colors">
            記事
          </Link>
          <Link href="/diagnosis" className="hover:text-[var(--color-brand)] transition-colors">
            価値観診断
          </Link>
        </nav>

        {/* 右側アクション */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white px-4 py-2 rounded-full transition-colors"
          >
            無料登録
          </Link>
        </div>

        {/* モバイルメニューボタン */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <span className="block w-5 h-0.5 bg-[var(--color-text-primary)] mb-1" />
          <span className="block w-5 h-0.5 bg-[var(--color-text-primary)] mb-1" />
          <span className="block w-5 h-0.5 bg-[var(--color-text-primary)]" />
        </button>
      </div>

      {/* モバイルドロワー */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/companies" onClick={() => setMenuOpen(false)}>企業を探す</Link>
          <Link href="/jobs" onClick={() => setMenuOpen(false)}>求人を見る</Link>
          <Link href="/articles" onClick={() => setMenuOpen(false)}>記事</Link>
          <Link href="/diagnosis" onClick={() => setMenuOpen(false)}>価値観診断</Link>
          <hr className="border-[var(--color-border)]" />
          <Link href="/login" onClick={() => setMenuOpen(false)}>ログイン</Link>
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="bg-[var(--color-accent)] text-white text-center py-2 rounded-full font-semibold"
          >
            無料登録
          </Link>
        </div>
      )}
    </header>
  );
}
