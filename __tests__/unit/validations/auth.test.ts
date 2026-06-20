import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, companyRegisterSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("正常な入力はパスする", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("メールアドレス形式が不正な場合はエラー", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("パスワードが空の場合はエラー", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = { name: "テスト太郎", email: "test@example.com", password: "password123" };

  it("正常な入力はパスする", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("パスワードが8文字未満はエラー", () => {
    const result = registerSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("8文字以上");
    }
  });

  it("名前が空はエラー", () => {
    expect(registerSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("メールが255文字超はエラー", () => {
    const longEmail = "a".repeat(250) + "@x.com";
    expect(registerSchema.safeParse({ ...valid, email: longEmail }).success).toBe(false);
  });
});

describe("companyRegisterSchema", () => {
  const valid = {
    company_name: "株式会社テスト",
    industry: "IT",
    location: "淡路島",
    name: "担当者名",
    email: "corp@example.com",
    password: "password123",
  };

  it("正常な入力はパスする", () => {
    expect(companyRegisterSchema.safeParse(valid).success).toBe(true);
  });

  it("website_urlは省略可能", () => {
    expect(companyRegisterSchema.safeParse({ ...valid, website_url: "" }).success).toBe(true);
    expect(companyRegisterSchema.safeParse({ ...valid, website_url: undefined }).success).toBe(true);
  });

  it("website_urlが無効なURLの場合はエラー", () => {
    expect(companyRegisterSchema.safeParse({ ...valid, website_url: "not-a-url" }).success).toBe(false);
  });

  it("website_urlが有効なURLの場合はパスする", () => {
    expect(companyRegisterSchema.safeParse({ ...valid, website_url: "https://example.com" }).success).toBe(true);
  });

  it("企業名が空はエラー", () => {
    expect(companyRegisterSchema.safeParse({ ...valid, company_name: "" }).success).toBe(false);
  });
});
