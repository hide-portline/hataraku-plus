import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = { success: boolean; remaining: number };

// ── Upstash Redis ──────────────────────────────────────────────
// UPSTASH_REDIS_REST_URL と UPSTASH_REDIS_REST_TOKEN が設定済みなら有効化
function createUpstashLimiters() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });

  return {
    login:           new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "15 m"), prefix: "rl:login" }),
    register:        new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5,  "60 m"), prefix: "rl:register" }),
    companyLogin:    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "15 m"), prefix: "rl:company_login" }),
    companyRegister: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3,  "60 m"), prefix: "rl:company_register" }),
  };
}

// ── インメモリフォールバック ──────────────────────────────────
const memMap = new Map<string, { count: number; reset: number }>();

const MEM_RULES: Record<string, { max: number; windowMs: number }> = {
  "/login":            { max: 10, windowMs: 15 * 60 * 1000 },
  "/register":         { max:  5, windowMs: 60 * 60 * 1000 },
  "/company/login":    { max: 10, windowMs: 15 * 60 * 1000 },
  "/company/register": { max:  3, windowMs: 60 * 60 * 1000 },
};

function checkMemory(ip: string, pathname: string): RateLimitResult {
  for (const [path, rule] of Object.entries(MEM_RULES)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      const key = `${ip}:${path}`;
      const now = Date.now();
      const entry = memMap.get(key);
      if (!entry || now > entry.reset) {
        memMap.set(key, { count: 1, reset: now + rule.windowMs });
        return { success: true, remaining: rule.max - 1 };
      }
      if (entry.count >= rule.max) return { success: false, remaining: 0 };
      entry.count++;
      return { success: true, remaining: rule.max - entry.count };
    }
  }
  return { success: true, remaining: 999 };
}

// ── 公開API ────────────────────────────────────────────────────
let upstash: ReturnType<typeof createUpstashLimiters> | undefined = undefined;

function getUpstash() {
  if (upstash === undefined) upstash = createUpstashLimiters();
  return upstash;
}

function getLimiterForPath(pathname: string) {
  const limiters = getUpstash();
  if (!limiters) return null;
  if (pathname === "/login" || pathname.startsWith("/login/"))                       return limiters.login;
  if (pathname === "/register" || pathname.startsWith("/register/"))                 return limiters.register;
  if (pathname === "/company/login" || pathname.startsWith("/company/login/"))       return limiters.companyLogin;
  if (pathname === "/company/register" || pathname.startsWith("/company/register/")) return limiters.companyRegister;
  return null;
}

export async function checkRateLimit(ip: string, pathname: string): Promise<RateLimitResult> {
  const limiter = getLimiterForPath(pathname);
  if (limiter) {
    const result = await limiter.limit(ip);
    return { success: result.success, remaining: result.remaining };
  }
  return checkMemory(ip, pathname);
}
