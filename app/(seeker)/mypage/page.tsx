import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions/auth";
import ValuesTypeBadge from "@/components/company/ValuesTypeBadge";
import Button from "@/components/ui/Button";
import DeleteAccountButton from "@/components/ui/DeleteAccountButton";
import type { ValuesType } from "@/types/database";

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: diagResult }, { data: apps }] = await Promise.all([
    supabase.from("users").select("*").eq("id", user!.id).single(),
    supabase.from("user_diagnosis_results").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("applications").select("*, jobs(title, companies(company_name))").eq("user_id", user!.id).order("applied_at", { ascending: false }).limit(5),
  ]);

  const initial = profile?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* ヘッダー */}
      <div className="bg-[var(--color-text-primary)] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 flex items-end gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-extrabold text-white shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-white/30 mb-1">My Page</p>
            <h1 className="text-2xl font-extrabold">{profile?.name}</h1>
            <p className="text-sm text-white/50 mt-0.5">{profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 上段：診断結果＋メニュー */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 価値観タイプ */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4">
              Values Type
            </p>
            {diagResult ? (
              <div>
                <ValuesTypeBadge type={diagResult.values_type as ValuesType} size="md" />
                <p className="text-xs text-[var(--color-text-muted)] mt-3 mb-5">
                  診断日: {new Date(diagResult.created_at).toLocaleDateString("ja-JP")}
                </p>
                <div className="flex gap-3">
                  <Link href="/diagnosis/result" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">結果を見る</Button>
                  </Link>
                  <Link href="/diagnosis" className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full">再診断する</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">未診断</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-5">
                  価値観診断を受けると、あなたに合った企業・求人が見つかります。
                </p>
                <Link href="/diagnosis">
                  <Button variant="secondary" size="sm" className="w-full">診断を受ける（無料）</Button>
                </Link>
              </div>
            )}
          </div>

          {/* メニュー */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4">
              Menu
            </p>
            <nav className="flex flex-col">
              {[
                { href: "/applications", label: "応募履歴" },
                { href: "/favorites", label: "お気に入り" },
                { href: "/profile/edit", label: "プロフィール編集" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between py-4 border-b border-[var(--color-border)] last:border-0 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand)] transition-colors group"
                >
                  {item.label}
                  <span className="text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </nav>
            <form action={logoutAction} className="mt-5">
              <Button type="submit" variant="ghost" size="sm" className="w-full text-red-500 hover:bg-red-50">
                ログアウト
              </Button>
            </form>
          </div>
        </div>

        {/* 応募履歴（最近5件） */}
        {apps && apps.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--color-border)] mb-8">
            <div className="flex justify-between items-center px-8 py-5 border-b border-[var(--color-border)]">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
                Recent Applications
              </p>
              <Link href="/applications" className="text-xs font-semibold text-[var(--color-brand)] hover:underline">
                すべて見る
              </Link>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {apps.map((app) => {
                const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
                return (
                  <div key={app.id} className="px-8 py-5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm text-[var(--color-text-primary)]">{job?.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {Array.isArray(job?.companies)
                          ? job.companies[0]?.company_name
                          : (job?.companies as { company_name: string } | null)?.company_name}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] shrink-0 ml-4">
                      {new Date(app.applied_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* アカウント削除 */}
        <div className="border-t border-[var(--color-border)] pt-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-5">
            Danger Zone
          </p>
          <div className="bg-white rounded-2xl border border-red-100 p-8">
            <p className="font-extrabold text-sm text-red-600 mb-1">アカウントを削除する</p>
            <p className="text-xs text-[var(--color-text-muted)] mb-5">
              削除すると、診断結果・応募履歴などすべてのデータが完全に消去されます。この操作は取り消せません。
            </p>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  );
}
