import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // POST リクエストにのみ rate limit を適用
  if (request.method === "POST") {
    // Vercel では request.ip が信頼できる値（プロキシ偽装不可）
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

  // Supabase セッションリフレッシュ
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
