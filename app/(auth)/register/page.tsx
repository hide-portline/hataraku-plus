"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  if (state?.emailSent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-3xl mx-auto mb-6">
          📧
        </div>
        <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-3">確認メールを送信しました</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8">
          メールボックスをご確認いただき、リンクをクリックして登録を完了してください。
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3.5 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] transition-colors text-center"
        >
          ログインページへ
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">無料会員登録</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-[var(--color-accent)] font-semibold hover:underline">ログイン</Link>
      </p>

      <form action={action} className="flex flex-col gap-4">
        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{state.error}</p>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide">お名前</label>
          <input
            id="name" name="name" type="text" required
            placeholder="山田 太郎"
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 focus:border-[var(--color-brand)] transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide">メールアドレス</label>
          <input
            id="email" name="email" type="email" required
            placeholder="example@email.com"
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 focus:border-[var(--color-brand)] transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide">パスワード（8文字以上）</label>
          <input
            id="password" name="password" type="password" required minLength={8}
            placeholder="••••••••"
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 focus:border-[var(--color-brand)] transition"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-bold hover:bg-[var(--color-accent-dark)] transition-colors disabled:opacity-50 mt-2"
        >
          {pending ? "登録中..." : "無料で登録する"}
        </button>
        <p className="text-center text-xs text-[var(--color-text-muted)]">
          登録することで
          <Link href="/terms" className="hover:underline mx-0.5">利用規約</Link>・
          <Link href="/privacy" className="hover:underline mx-0.5">プライバシーポリシー</Link>
          に同意したものとみなします
        </p>
      </form>
    </>
  );
}
