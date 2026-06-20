"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCompanyRegistered } from "@/lib/email/send";

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

  // //evil.com のようなプロトコル相対URLによるオープンリダイレクトを防止
  const safeRedirect = /^\/[^/]/.test(redirectTo) ? redirectTo : "/mypage";
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

export async function deleteAccountAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // auth.users から削除 → ON DELETE CASCADE で関連データも全削除
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) redirect("/?error=delete_failed");

  redirect("/");
}

export async function companyRegisterAction(
  _prevState: { error?: string; registered?: boolean } | undefined,
  formData: FormData
) {
  const companyName = (formData.get("company_name") as string)?.trim();
  const industry    = (formData.get("industry")     as string)?.trim();
  const location    = (formData.get("location")     as string)?.trim();
  const websiteUrl  = (formData.get("website_url")  as string)?.trim();
  const name        = (formData.get("name")         as string)?.trim();
  const email       = (formData.get("email")        as string)?.trim();
  const password    =  formData.get("password")     as string;

  if (!companyName || !industry || !location || !name || !email || !password) {
    return { error: "必須項目をすべて入力してください（ウェブサイトURLのみ任意）" };
  }
  if (password.length < 8) {
    return { error: "パスワードは8文字以上で設定してください" };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  // 1. auth ユーザーを作成
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (signUpError) {
    if (signUpError.message.includes("already registered") || signUpError.message.includes("already been registered")) {
      return { error: "このメールアドレスはすでに登録されています" };
    }
    return { error: `アカウント作成に失敗しました: ${signUpError.message}` };
  }
  if (!data.user) return { error: "アカウント作成に失敗しました" };

  // 2. public.users を先に作成（メール未確認でもFKエラーが起きないよう）
  await admin.from("users").upsert({
    id: data.user.id,
    name,
    email,
  }, { onConflict: "id" });

  // 3. 企業レコードを作成（admin client でRLSをバイパス）
  const { data: company, error: companyError } = await admin
    .from("companies")
    .insert({
      company_name: companyName,
      industry:     industry    || null,
      location:     location    || null,
      website_url:  websiteUrl  || null,
      contact_email: email,
      status: "pending",
    })
    .select("id")
    .single();
  if (companyError || !company) {
    return { error: `企業情報の登録に失敗しました: ${companyError?.message ?? "不明なエラー"}` };
  }

  // 4. company_members に owner として登録（admin client でRLSをバイパス）
  const { error: memberError } = await admin
    .from("company_members")
    .insert({ company_id: company.id, user_id: data.user.id, role: "owner" });
  if (memberError) return { error: `メンバー情報の登録に失敗しました: ${memberError.message}` };

  // 4. 受付確認メールを送信（失敗してもエラーにしない）
  await sendCompanyRegistered({ companyEmail: email, companyName }).catch(() => null);

  return { registered: true };
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
