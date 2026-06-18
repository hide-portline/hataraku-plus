import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions/auth";

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
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <aside className="w-52 bg-gray-900 text-white shrink-0 flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">管理者</p>
          <p className="font-bold text-sm mt-1">HATARAKU+</p>
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
