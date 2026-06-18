"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  if (state?.emailSent) {
    return (
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="text-2xl font-bold text-[var(--color-brand)] block mb-6">
          HATARAKU+
        </Link>
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-8">
          <p className="text-4xl mb-4">📧</p>
          <h2 className="font-bold text-[var(--color-text-primary)] text-lg mb-2">確認メールを送信しました</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            メールボックスをご確認いただき、リンクをクリックして登録を完了してください。
          </p>
          <Link href="/login" className="block mt-6">
            <Button variant="outline" className="w-full">ログインページへ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-[var(--color-brand)] block mb-6">
          HATARAKU+
        </Link>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">無料会員登録</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">価値観診断で理想の企業を見つけよう</p>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-4">
        {state?.error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
        )}
        <Input id="name" name="name" label="お名前" type="text" placeholder="山田 太郎" required />
        <Input id="email" name="email" label="メールアドレス" type="email" placeholder="example@email.com" required />
        <Input id="password" name="password" label="パスワード（8文字以上）" type="password" placeholder="••••••••" minLength={8} required />
        <Button type="submit" variant="secondary" className="w-full mt-2" disabled={pending}>
          {pending ? "登録中..." : "無料で登録する"}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-[var(--color-brand)] font-semibold hover:underline">ログイン</Link>
      </p>
    </div>
  );
}
