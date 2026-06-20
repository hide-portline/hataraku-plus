import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions/auth";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "🏠 管理TOP" },
  { href: "/admin/companies", label: "🏢 企業管理" },
  { href: "/admin/jobs", label: "📋 求人管理" },
  { href: "/admin/users", label: "👥 ユーザー管理" },
  { href: "/admin/announcements", label: "📢 お知らせ" },
  { href: "/admin/regions", label: "🗺️ 地域マスター" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const email = user.email?.toLowerCase();
  if (!adminEmails || adminEmails.length === 0 || !email || !adminEmails.includes(email)) {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* モバイル: トップナビ */}
      <header className="md:hidden bg-gray-900 text-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <p className="font-bold text-sm">Hataraku+ 管理</p>
          <form action={logoutAction}>
            <button className="text-xs text-white/60 hover:text-white">ログアウト</button>
          </form>
        </div>
        <nav className="flex overflow-x-auto px-2 py-2 gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* デスクトップ: サイドバー */}
      <aside className="hidden md:flex w-52 bg-gray-900 text-white shrink-0 flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">管理者</p>
          <p className="font-bold text-sm mt-1">Hataraku+</p>
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
            <button className="text-sm text-white/40 hover:text-white py-2 px-3">ログアウト</button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-[var(--color-surface)] overflow-auto">{children}</main>
    </div>
  );
}
