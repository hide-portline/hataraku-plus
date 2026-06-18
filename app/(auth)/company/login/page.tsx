"use client";

import Link from "next/link";
import { useActionState } from "react";
import { companyLoginAction } from "@/lib/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CompanyLoginPage() {
  const [state, action, pending] = useActionState(companyLoginAction, undefined);

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-widest mb-2">
          企業様向け
        </p>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">企業ログイン</h1>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-4">
        {state?.error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
        )}
        <Input id="email" name="email" label="メールアドレス" type="email" placeholder="company@example.com" required />
        <Input id="password" name="password" label="パスワード" type="password" placeholder="••••••••" required />
        <Button type="submit" className="w-full mt-2" disabled={pending}>
          {pending ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
        <Link href="/" className="hover:underline">
          ← サイトトップへ
        </Link>
      </p>
    </div>
  );
}
