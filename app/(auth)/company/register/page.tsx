"use client";

import Link from "next/link";
import { useActionState } from "react";
import { companyRegisterAction } from "@/lib/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CompanyRegisterPage() {
  const [state, action, pending] = useActionState(companyRegisterAction, undefined);

  if (state?.redirectToLogin) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-6">📋</div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
          すでに登録済みです
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
          このメールアドレスはすでに登録されています。<br />
          企業ログインページからお入りください。
        </p>
        <Link
          href="/company/login"
          className="inline-block px-6 py-3 rounded-xl bg-[var(--color-brand)] text-white text-sm font-semibold hover:opacity-90 transition"
        >
          企業ログインページへ →
        </Link>
      </div>
    );
  }

  if (state?.registered) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
          登録を受け付けました
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
          ご登録ありがとうございます。<br />
          担当者がご入力の内容を確認し、<br />
          通常1〜3営業日以内にご連絡いたします。
        </p>
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 text-left text-sm text-[var(--color-text-secondary)] mb-6">
          <p className="font-semibold text-[var(--color-text-primary)] mb-2">次のステップ</p>
          <ol className="list-decimal list-inside space-y-1.5">
            <li>登録メールアドレスに確認メールが届きます</li>
            <li>メール内のリンクをクリックして認証を完了してください</li>
            <li>管理者による審査後、ログインできるようになります</li>
          </ol>
        </div>
        <Link
          href="/company/login"
          className="text-sm text-[var(--color-brand)] hover:underline"
        >
          ログインページへ →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-widest mb-2">
          企業様向け
        </p>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">企業アカウント登録</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          登録後、管理者が審査を行います（1〜3営業日）
        </p>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-5">
        {state?.error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
        )}

        <fieldset className="flex flex-col gap-4">
          <legend className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
            企業情報
          </legend>
          <Input
            id="company_name" name="company_name" label="会社名" required
            placeholder="株式会社○○"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="industry" className="text-sm font-semibold text-[var(--color-text-primary)]">
              業種 <span className="text-red-500">*</span>
            </label>
            <select
              id="industry" name="industry" required
              className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 focus:border-[var(--color-brand)] transition"
              defaultValue=""
            >
              <option value="" disabled>選択してください</option>
              <option value="農業・漁業">農業・漁業</option>
              <option value="食品製造・加工">食品製造・加工</option>
              <option value="観光・宿泊">観光・宿泊</option>
              <option value="飲食">飲食</option>
              <option value="IT・テクノロジー">IT・テクノロジー</option>
              <option value="製造業">製造業</option>
              <option value="建設・不動産">建設・不動産</option>
              <option value="医療・福祉">医療・福祉</option>
              <option value="教育">教育</option>
              <option value="小売・販売">小売・販売</option>
              <option value="その他">その他</option>
            </select>
          </div>
          <Input
            id="location" name="location" label="所在地" required
            placeholder="兵庫県淡路市○○"
          />
          <Input
            id="website_url" name="website_url" label="ウェブサイトURL" type="url"
            placeholder="https://example.com"
          />
        </fieldset>

        <hr className="border-[var(--color-border)]" />

        <fieldset className="flex flex-col gap-4">
          <legend className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
            担当者情報（ログインアカウント）
          </legend>
          <Input
            id="name" name="name" label="担当者名" required
            placeholder="山田 太郎"
          />
          <Input
            id="email" name="email" label="メールアドレス" type="email" required
            placeholder="contact@example.com"
          />
          <div>
            <Input
              id="password" name="password" label="パスワード" type="password" required
              placeholder="8文字以上"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1 ml-1">8文字以上で設定してください</p>
          </div>
        </fieldset>

        <Button type="submit" className="w-full mt-2" disabled={pending}>
          {pending ? "登録中..." : "登録申請する"}
        </Button>

        <p className="text-xs text-[var(--color-text-muted)] text-center">
          登録申請することで、
          <Link href="/terms" className="underline hover:text-[var(--color-brand)]">利用規約</Link>
          および
          <Link href="/privacy" className="underline hover:text-[var(--color-brand)]">プライバシーポリシー</Link>
          に同意したものとみなします。
        </p>
      </form>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/company/login" className="text-[var(--color-brand)] font-semibold hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
