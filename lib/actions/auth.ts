"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCompanyRegistered } from "@/lib/email/send";
import { loginSchema, registerSchema, companyRegisterSchema } from "@/lib/validations/auth";
import { logError } from "@/lib/monitoring";

function getAdminEmails(): string[] {
  return process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean) ?? [];
}

export async function adminLoginAction(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const raw = { email: formData.get("email"), password: formData.get("password") };
  const result = loginSchema.safeParse(raw);
  if (!result.success) return { error: result.error.issues[0].message };

  const { email, password } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "メールアドレスまたはパスワードが正しくありません" };

  if (!getAdminEmails().includes(email.toLowerCase())) {
    await supabase.auth.signOut();
    return { error: "管理者権限がありません" };
  }

  redirect("/admin");
}

export async function loginAction(
  redirectTo: string,
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const raw = { email: formData.get("email"), password: formData.get("password") };
  const result = loginSchema.safeParse(raw);
  if (!result.success) return { error: result.error.issues[0].message };

  const { email, password } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "メールアドレスまたはパスワードが正しくありません" };

  if (getAdminEmails().includes(email.toLowerCase())) {
    redirect("/admin");
  }

  // //evil.com のようなプロトコル相対URLによるオープンリダイレクトを防止
  const safeRedirect = /^\/[^/]/.test(redirectTo) ? redirectTo : "/mypage";
  redirect(safeRedirect);
}

export async function registerAction(
  _prevState: { error?: string; emailSent?: boolean; redirectToLogin?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; emailSent?: boolean; redirectToLogin?: boolean } | undefined> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = registerSchema.safeParse(raw);
  if (!result.success) return { error: result.error.issues[0].message };

  const { name, email, password } = result.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://hataraku-plus.vercel.app"}/auth/callback`,
    },
  });

  if (error) return { error: "登録に失敗しました。別のメールアドレスをお試しください" };
  if (!data.user) return { error: "登録に失敗しました" };

  // 既存メール（Supabaseはエラーを返さず identities が空になる）
  if (data.user.identities?.length === 0) return { redirectToLogin: true };

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
  _prevState: { error?: string; registered?: boolean; redirectToLogin?: boolean } | undefined,
  formData: FormData
) {
  const raw = {
    company_name: formData.get("company_name"),
    industry: formData.get("industry"),
    location: formData.get("location"),
    website_url: formData.get("website_url"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = companyRegisterSchema.safeParse(raw);
  if (!result.success) return { error: result.error.issues[0].message };

  const { company_name, industry, location, website_url, name, email, password } = result.data;

  const supabase = await createClient();
  const admin = createAdminClient();

  // 1. auth ユーザーを作成
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://hataraku-plus.vercel.app"}/auth/callback`,
    },
  });
  if (signUpError) {
    if (signUpError.message.includes("already registered") || signUpError.message.includes("already been registered")) {
      return { redirectToLogin: true };
    }
    return { error: `アカウント作成に失敗しました: ${signUpError.message}` };
  }
  if (!data.user) return { error: "アカウント作成に失敗しました" };
  // メール確認ONの場合、既存ユーザーは identities が空で返る
  if (data.user.identities?.length === 0) return { redirectToLogin: true };

  // 2-4. users・companies・company_members をDBファンクションで一括登録（トランザクション保証）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: registerError } = await (admin as any).rpc("register_company", {
    p_user_id:     data.user.id,
    p_name:        name,
    p_email:       email,
    p_company_name: company_name,
    p_industry:    industry || null,
    p_location:    location || null,
    p_website_url: website_url || null,
  });
  if (registerError) {
    // auth.users が作成済みのためロールバックできないが、ゾンビ化を防ぐため auth ユーザーを削除
    await admin.auth.admin.deleteUser(data.user.id).catch(() => null);
    return { error: `企業登録に失敗しました: ${registerError.message}` };
  }

  // 受付確認メールを送信（失敗してもエラーにしない）
  await sendCompanyRegistered({ companyEmail: email, companyName: company_name }).catch(
    logError("companyRegister:sendMail")
  );

  return { registered: true };
}

export async function companyLoginAction(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const raw = { email: formData.get("email"), password: formData.get("password") };
  const result = loginSchema.safeParse(raw);
  if (!result.success) return { error: result.error.issues[0].message };

  const { email, password } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "メールアドレスまたはパスワードが正しくありません" };

  redirect("/dashboard");
}
