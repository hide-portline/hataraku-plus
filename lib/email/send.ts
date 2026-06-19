"use server";

import { getResend, FROM } from "./resend";
import { createClient } from "@/lib/supabase/server";

type EmailResult = { success: boolean; error?: string };

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendApplicationReceived(opts: {
  companyEmail: string;
  companyName: string;
  seekerName: string;
  jobTitle: string;
  applicationId: string;
}): Promise<EmailResult> {
  const { error } = await getResend().emails.send({
    from: FROM,
    to: opts.companyEmail,
    subject: `【Hataraku+】新しい応募が届きました：${opts.seekerName}さん`,
    html: `
      <h2>新しい応募が届きました</h2>
      <p>${esc(opts.companyName)} 採用ご担当者様</p>
      <p><strong>${esc(opts.seekerName)}</strong>さんが「${esc(opts.jobTitle)}」に応募しました。</p>
      <p>ダッシュボードから応募者の詳細をご確認ください。</p>
      <p>直接応募者へご連絡をお願いいたします。</p>
    `,
  });
  await logEmail("application_received", opts.companyEmail, error?.message);
  return { success: !error, error: error?.message };
}

export async function sendApplicationConfirm(opts: {
  seekerEmail: string;
  seekerName: string;
  jobTitle: string;
  companyName: string;
}): Promise<EmailResult> {
  const { error } = await getResend().emails.send({
    from: FROM,
    to: opts.seekerEmail,
    subject: `【Hataraku+】「${opts.jobTitle}」への応募が完了しました`,
    html: `
      <h2>応募完了のお知らせ</h2>
      <p>${esc(opts.seekerName)} 様</p>
      <p>「<strong>${esc(opts.companyName)}</strong>」の「${esc(opts.jobTitle)}」への応募が完了しました。</p>
      <p>企業からの連絡をお待ちください。</p>
    `,
  });
  await logEmail("application_confirm", opts.seekerEmail, error?.message);
  return { success: !error, error: error?.message };
}

export async function sendCompanyRegistered(opts: {
  companyEmail: string;
  companyName: string;
}): Promise<EmailResult> {
  const { error } = await getResend().emails.send({
    from: FROM,
    to: opts.companyEmail,
    subject: "【Hataraku+】企業登録を受け付けました",
    html: `
      <h2>企業登録受付のご案内</h2>
      <p>${esc(opts.companyName)} ご担当者様</p>
      <p>企業登録のお申し込みを受け付けました。</p>
      <p>担当者が内容を確認し、通常1〜3営業日以内にご連絡いたします。</p>
    `,
  });
  await logEmail("company_registered", opts.companyEmail, error?.message);
  return { success: !error, error: error?.message };
}

export async function sendPasswordReset(opts: {
  email: string;
  resetUrl: string;
}): Promise<EmailResult> {
  const { error } = await getResend().emails.send({
    from: FROM,
    to: opts.email,
    subject: "【Hataraku+】パスワードリセットのご案内",
    html: `
      <h2>パスワードリセット</h2>
      <p>以下のリンクからパスワードを再設定してください。</p>
      <p><a href="${esc(opts.resetUrl)}">${esc(opts.resetUrl)}</a></p>
      <p>このリンクの有効期限は1時間です。</p>
    `,
  });
  await logEmail("password_reset", opts.email, error?.message);
  return { success: !error, error: error?.message };
}

async function logEmail(template: string, toEmail: string, errorMsg?: string) {
  try {
    const supabase = await createClient();
    await supabase.from("email_logs").insert({
      to_email: toEmail,
      template_name: template,
      subject: template,
      status: errorMsg ? "failed" : "sent",
      metadata: errorMsg ? { error: errorMsg } : null,
    });
  } catch {
    // ログ失敗はサイレントに
  }
}
