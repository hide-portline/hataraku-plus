import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

async function createAnnouncement(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const publish = formData.get("publish") === "true";
  await supabase.from("announcements").insert({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    target: (formData.get("target") as "all" | "seeker" | "company") || "all",
    is_published: publish,
    published_at: publish ? new Date().toISOString() : null,
  });
  redirect("/admin/announcements");
}

async function toggleAnnouncement(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";
  const supabase = await createClient();
  await supabase.from("announcements").update({
    is_published: !current,
    published_at: !current ? new Date().toISOString() : null,
  }).eq("id", id);
  redirect("/admin/announcements");
}

async function deleteAnnouncement(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("announcements").delete().eq("id", id);
  redirect("/admin/announcements");
}

const SELECT_CLASS = "w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm bg-white outline-none focus:border-[var(--color-brand)]";
const TEXTAREA_CLASS = "w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-brand)] resize-none";
const TARGET_LABELS: Record<string, string> = { all: "全員", seeker: "求職者", company: "企業" };

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("id", { ascending: false });

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">お知らせ管理</h1>

      {/* 作成フォーム */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 mb-8">
        <h2 className="font-bold text-[var(--color-text-primary)] mb-4">新規お知らせを作成</h2>
        <form className="flex flex-col gap-4">
          <Input id="title" name="title" label="タイトル *" required placeholder="例: メンテナンスのお知らせ" />
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">本文 *</label>
            <textarea name="content" rows={4} required className={TEXTAREA_CLASS} placeholder="お知らせの内容を書いてください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">対象</label>
            <select name="target" className={SELECT_CLASS}>
              <option value="all">全員</option>
              <option value="seeker">求職者のみ</option>
              <option value="company">企業のみ</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              formAction={async (fd) => { "use server"; fd.set("publish", "false"); return createAnnouncement(fd); }}
              className="flex-1 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
            >
              下書き保存
            </button>
            <button
              type="submit"
              formAction={async (fd) => { "use server"; fd.set("publish", "true"); return createAnnouncement(fd); }}
              className="flex-1 py-2.5 rounded-full bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-colors"
            >
              公開する
            </button>
          </div>
        </form>
      </div>

      {/* 一覧 */}
      <div className="flex flex-col gap-3">
        {announcements?.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    a.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {a.is_published ? "公開中" : "下書き"}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-0.5 rounded-full">
                    {TARGET_LABELS[a.target]}
                  </span>
                </div>
                <p className="font-semibold text-[var(--color-text-primary)]">{a.title}</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">{a.content}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <form action={toggleAnnouncement}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="current" value={String(a.is_published)} />
                  <button className="text-xs text-[var(--color-brand)] hover:underline w-full text-right">
                    {a.is_published ? "非公開にする" : "公開する"}
                  </button>
                </form>
                <form action={deleteAnnouncement}>
                  <input type="hidden" name="id" value={a.id} />
                  <button className="text-xs text-red-500 hover:underline w-full text-right">削除</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {(!announcements || announcements.length === 0) && (
          <p className="text-center py-8 text-[var(--color-text-muted)]">まだお知らせがありません</p>
        )}
      </div>
    </div>
  );
}
