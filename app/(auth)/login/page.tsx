"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction } from "@/lib/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/mypage";
  const [state, action, pending] = useActionState(loginAction.bind(null, redirect), undefined);

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-[var(--color-brand)] block mb-6">
          HATARAKU+
        </Link>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">ログイン</h1>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-4">
        {state?.error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
        )}
        <Input id="email" name="email" label="メールアドレス" type="email" placeholder="example@email.com" required />
        <Input id="password" name="password" label="パスワード" type="password" placeholder="••••••••" required />
        <Button type="submit" className="w-full mt-2" disabled={pending}>
          {pending ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="text-[var(--color-brand)] font-semibold hover:underline">新規登録</Link>
      </p>
      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-2">
        企業の方は{" "}
        <Link href="/company/login" className="text-[var(--color-brand)] font-semibold hover:underline">こちら</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
