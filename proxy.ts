import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const SEEKER_PATHS = ["/mypage", "/profile", "/diagnosis", "/applications", "/favorites"];
const COMPANY_PATHS = ["/dashboard", "/company/profile", "/company/jobs", "/company/applications"];
const ADMIN_PATHS = ["/admin"];

// インメモリ rate limit（Vercel の各 worker インスタンスで独立して動作）
const rlMap = new Map<string, { count: number; reset: number }>();

const RL_RULES: Record<string, { max: number; windowMs: number }> = {
  "/login":            { max: 10, windowMs: 15 * 60 * 1000 },
  "/register":         { max:  5, windowMs: 60 * 60 * 1000 },
  "/company/login":    { max: 10, windowMs: 15 * 60 * 1000 },
  "/company/register": { max:  3, windowMs: 60 * 60 * 1000 },
};

function checkRateLimit(ip: string, pathname: string): boolean {
  for (const [path, rule] of Object.entries(RL_RULES)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      const key = `${ip}:${path}`;
      const now = Date.now();
      const entry = rlMap.get(key);
      if (!entry || now > entry.reset) {
        rlMap.set(key, { count: 1, reset: now + rule.windowMs });
        return true;
      }
      if (entry.count >= rule.max) return false;
      entry.count++;
      return true;
    }
  }
  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // POST リクエストにのみ rate limit を適用
  if (request.method === "POST") {
    const ip =
      (request as unknown as { ip?: string }).ip ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (!checkRateLimit(ip, pathname)) {
      return new NextResponse(
        "リクエストが多すぎます。しばらく待ってから再試行してください。",
        { status: 429, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }
  }

  const { supabaseResponse, user } = await updateSession(request);

  const isProtected =
    SEEKER_PATHS.some((p) => pathname.startsWith(p)) ||
    COMPANY_PATHS.some((p) => pathname.startsWith(p)) ||
    ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
