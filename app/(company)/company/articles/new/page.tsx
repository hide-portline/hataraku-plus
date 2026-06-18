import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

async function createArticle(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/company/login");

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  if (!membership) redirect("/dashboard");

  const publish = formData.get("publish") === "true";

  await supabase.from("articles").insert({
    company_id: membership.company_id,
    author_user_id: user.id,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
    article_type: "story",
    is_published: publish,
    published_at: publish ? new Date().toISOString() : null,
  });

  redirect("/dashboard");
}

const TEXTAREA_CLASS = "w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors resize-none";

export default function NewArticlePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/dashboard" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">← ダッシュボード</a>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">ストーリー記事を作成</h1>
      </div>

      <form className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col gap-5">
        <Input id="title" name="title" label="タイトル *" placeholder="例: 淡路島で農業と飲食をつなぐ挑戦" required />
        <Input id="thumbnail_url" name="thumbnail_url" label="サムネイル画像URL" type="url" placeholder="https://example.com/image.jpg" />

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">本文 *</label>
          <textarea
            name="content"
            rows={12}
            required
            placeholder="会社のストーリー、代表メッセージ、チームの雰囲気などを自由に書いてください..."
            className={TEXTAREA_CLASS}
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">改行はそのまま反映されます</p>
        </div>

        <div className="flex gap-3 mt-2">
          <a href="/dashboard" className="flex-1">
            <Button type="button" variant="outline" className="w-full">キャンセル</Button>
          </a>
          <button
            type="submit"
            formAction={async (fd) => {
              "use server";
              fd.set("publish", "false");
              return createArticle(fd);
            }}
            className="flex-1 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            下書き保存
          </button>
          <button
            type="submit"
            formAction={async (fd) => {
              "use server";
              fd.set("publish", "true");
              return createArticle(fd);
            }}
            className="flex-1 py-2.5 rounded-full bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-colors"
          >
            公開する
          </button>
        </div>
      </form>
    </div>
  );
}
