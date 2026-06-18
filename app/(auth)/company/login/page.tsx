import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CompanyLoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-widest mb-2">
          企業様向け
        </p>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">企業ログイン</h1>
      </div>

      <form className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-4">
        <Input id="email" label="メールアドレス" type="email" placeholder="company@example.com" />
        <Input id="password" label="パスワード" type="password" placeholder="••••••••" />
        <Button type="submit" className="w-full mt-2">
          ログイン
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
