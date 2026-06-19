import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions/auth";

const NAV = [
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/company/jobs", label: "求人管理" },
  { href: "/company/applications", label: "応募管理" },
  { href: "/company/profile/edit", label: "企業情報編集" },
  { href: "/company/diagnosis", label: "価値観診断" },
  { href: "/company/articles/new", label: "ストーリー記事" },
];

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { data: membership } = await supabase
    .from("company_members")
    .select("companies(company_name, status)")
    .eq("user_id", user.id)
    .single();

  const company = membership?.companies
    ? (Array.isArray(membership.companies) ? membership.companies[0] : membership.companies)
    : null;

  return (
    <div className="min-h-screen flex">
      {/* サイドバー */}
      <aside className="w-56 bg-[var(--color-brand)] text-white shrink-0 flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <Link href="/" className="text-sm font-bold text-white/80 hover:text-white">Hataraku+</Link>
          <p className="text-xs text-white/50 mt-1 truncate">{company?.company_name ?? "企業名未設定"}</p>
          {company?.status === "pending" && (
            <span className="inline-block mt-2 text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">審査中</span>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <form action={logoutAction}>
            <button className="w-full text-sm text-white/50 hover:text-white py-2 text-left px-3">
              ログアウト
            </button>
          </form>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 bg-[var(--color-surface)] overflow-auto">{children}</main>
    </div>
  );
}
