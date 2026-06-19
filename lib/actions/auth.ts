"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(
  redirectTo: string,
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "メールアドレスまたはパスワードが正しくありません" };

  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/mypage";
  redirect(safeRedirect);
}

export async function registerAction(
  _prevState: { error?: string; emailSent?: boolean } | undefined,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  // name をメタデータに渡す → DBトリガーがユーザーレコードを自動作成する
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: "登録に失敗しました。別のメールアドレスをお試しください" };
  if (!data.user) return { error: "登録に失敗しました" };

  // メール確認が必要な場合（セッションがない）
  if (!data.session) {
    return { emailSent: true };
  }

  redirect("/diagnosis");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function companyLoginAction(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "メールアドレスまたはパスワードが正しくありません" };

  redirect("/dashboard");
}
