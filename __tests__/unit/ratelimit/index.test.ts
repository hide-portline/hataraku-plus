import { describe, it, expect, beforeEach, vi } from "vitest";

// memMapはモジュールレベルのMapなので、テスト間でstateが共有される
// → 各テストで一意のIPを使って干渉を防ぐ

describe("checkRateLimit — インメモリフォールバック", () => {
  let checkRateLimit: (ip: string, pathname: string) => Promise<{ success: boolean; remaining: number }>;

  beforeEach(async () => {
    // Upstash環境変数なしで毎回クリーンなモジュール状態にする
    vi.resetModules();
    const mod = await import("@/lib/ratelimit/index");
    checkRateLimit = mod.checkRateLimit;
  });

  it("/loginパスはレート制限対象（remaining < 999）", async () => {
    const result = await checkRateLimit("192.0.2.1", "/login");
    expect(result.success).toBe(true);
    expect(typeof result.remaining).toBe("number");
    expect(result.remaining).toBeLessThan(999);
  });

  it("制限対象外のパスは常に成功（remaining=999）", async () => {
    const result = await checkRateLimit("192.0.2.2", "/jobs");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(999);
  });

  it("/company/registerは最も制限が厳しい（max=3）", async () => {
    const ip = "192.0.2.3";
    const path = "/company/register";

    const r1 = await checkRateLimit(ip, path);
    const r2 = await checkRateLimit(ip, path);
    const r3 = await checkRateLimit(ip, path);

    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r3.success).toBe(true);

    const r4 = await checkRateLimit(ip, path);
    expect(r4.success).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it("IPが異なれば独立してカウントされる", async () => {
    const path = "/company/register";

    await checkRateLimit("192.0.2.10", path);
    await checkRateLimit("192.0.2.10", path);
    await checkRateLimit("192.0.2.10", path);
    const blocked = await checkRateLimit("192.0.2.10", path);
    expect(blocked.success).toBe(false);

    // 別IPは影響を受けない
    const other = await checkRateLimit("192.0.2.11", path);
    expect(other.success).toBe(true);
  });

  it("/registerは5回で上限", async () => {
    const ip = "192.0.2.20";
    const path = "/register";
    for (let i = 0; i < 5; i++) {
      const r = await checkRateLimit(ip, path);
      expect(r.success).toBe(true);
    }
    const r6 = await checkRateLimit(ip, path);
    expect(r6.success).toBe(false);
  });
});
