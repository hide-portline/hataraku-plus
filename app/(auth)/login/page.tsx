"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction } from "@/lib/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/mypage";
  const [state, action, pending] = useActionState(loginAction.bind(null, redirect), undefined);

  return (
    <>
      <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">ログイン</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="text-[var(--color-accent)] font-semibold hover:underline">無料登録</Link>
      </p>

      <form action={action} className="flex flex-col gap-4">
        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{state.error}</p>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide">メールアドレス</label>
          <input
            id="email" name="email" type="email" required
            placeholder="example@email.com"
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 focus:border-[var(--color-brand)] transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide">パスワード</label>
          <input
            id="password" name="password" type="password" required
            placeholder="••••••••"
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 focus:border-[var(--color-brand)] transition"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 rounded-xl bg-[var(--color-text-primary)] text-white text-sm font-bold hover:bg-[var(--color-brand)] transition-colors disabled:opacity-50 mt-2"
        >
          {pending ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p className="text-center text-xs text-[var(--color-text-muted)] mt-8">
        企業の方は{" "}
        <Link href="/company/login" className="text-[var(--color-brand)] font-semibold hover:underline">こちら</Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
