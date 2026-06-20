import { z } from "zod";

const email = z.string().email("有効なメールアドレスを入力してください").max(255);
const password = z.string().min(8, "パスワードは8文字以上で設定してください").max(128);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "パスワードを入力してください"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "氏名を入力してください").max(100),
  email,
  password,
});

export const companyRegisterSchema = z.object({
  company_name: z.string().min(1, "企業名を入力してください").max(200),
  industry: z.string().min(1, "業種を入力してください").max(100),
  location: z.string().min(1, "所在地を入力してください").max(200),
  website_url: z.string().url("有効なURLを入力してください").max(500).optional().or(z.literal("")),
  name: z.string().min(1, "担当者名を入力してください").max(100),
  email,
  password,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CompanyRegisterInput = z.infer<typeof companyRegisterSchema>;
