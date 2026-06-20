import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit } from "@/lib/ratelimit";

const SEEKER_PATHS  = ["/mypage", "/profile", "/diagnosis", "/applications", "/favorites"];
const COMPANY_PATHS = ["/dashboard", "/company/profile", "/company/jobs", "/company/applications"];
const ADMIN_PATHS   = ["/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // POST リクエストにのみレート制限を適用
  if (request.method === "POST") {
    const ip =
      (request as unknown as { ip?: string }).ip ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const { success } = await checkRateLimit(ip, pathname);
    if (!success) {
      return new NextResponse(
        "リクエストが多すぎます。しばらく待ってから再試行してください。",
        { status: 429, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }
  }

  const { supabaseResponse, user } = await updateSession(request);

  const isProtected =
    SEEKER_PATHS.some((p)  => pathname === p || pathname.startsWith(p + "/")) ||
    COMPANY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    ADMIN_PATHS.some((p)   => pathname === p || pathname.startsWith(p + "/"));

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
