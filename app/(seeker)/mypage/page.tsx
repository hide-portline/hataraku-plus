import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions/auth";
import ValuesTypeBadge from "@/components/company/ValuesTypeBadge";
import Button from "@/components/ui/Button";
import type { ValuesType } from "@/types/database";

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: diagResult }, { data: apps }] = await Promise.all([
    supabase.from("users").select("*").eq("id", user!.id).single(),
    supabase.from("user_diagnosis_results").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("applications").select("*, jobs(title, companies(company_name))").eq("user_id", user!.id).order("applied_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">マイページ</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* プロフィール */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
          <div className="w-16 h-16 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-2xl font-bold text-[var(--color-brand)] mb-4">
            {profile?.name?.charAt(0) ?? "?"}
          </div>
          <p className="font-bold text-[var(--color-text-primary)] mb-1">{profile?.name}</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">{profile?.email}</p>
          <Link href="/profile/edit">
            <Button variant="outline" size="sm" className="w-full">プロフィール編集</Button>
          </Link>
        </div>

        {/* 診断結果 */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
          <h2 className="font-bold text-[var(--color-text-primary)] mb-3">価値観タイプ</h2>
          {diagResult ? (
            <div>
              <ValuesTypeBadge type={diagResult.values_type as ValuesType} size="md" />
              <p className="text-xs text-[var(--color-text-muted)] mt-3">
                診断日: {new Date(diagResult.created_at).toLocaleDateString("ja-JP")}
              </p>
              <Link href="/diagnosis" className="block mt-3">
                <Button variant="ghost" size="sm" className="w-full">再診断する</Button>
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">まだ診断を受けていません</p>
              <Link href="/diagnosis">
                <Button variant="secondary" size="sm" className="w-full">診断を受ける</Button>
              </Link>
            </div>
          )}
        </div>

        {/* クイックリンク */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
          <h2 className="font-bold text-[var(--color-text-primary)] mb-3">メニュー</h2>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/applications" className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] py-1.5 border-b border-[var(--color-border)]">応募履歴</Link>
            <Link href="/favorites" className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] py-1.5 border-b border-[var(--color-border)]">お気に入り</Link>
            <Link href="/diagnosis/result" className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] py-1.5 border-b border-[var(--color-border)]">診断結果</Link>
          </nav>
          <form action={logoutAction} className="mt-4">
            <Button type="submit" variant="ghost" size="sm" className="w-full text-red-500 hover:bg-red-50">ログアウト</Button>
          </form>
        </div>
      </div>

      {/* 応募履歴（最近5件） */}
      {apps && apps.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[var(--color-text-primary)]">最近の応募</h2>
            <Link href="/applications" className="text-sm text-[var(--color-brand)] hover:underline">すべて見る</Link>
          </div>
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm divide-y divide-[var(--color-border)]">
            {apps.map((app) => {
              const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
              return (
                <div key={app.id} className="px-5 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text-primary)]">{job?.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {Array.isArray(job?.companies) ? job.companies[0]?.company_name : (job?.companies as { company_name: string } | null)?.company_name}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {new Date(app.applied_at).toLocaleDateString("ja-JP")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
