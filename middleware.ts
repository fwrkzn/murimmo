import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { VISITOR_ACCESS_COOKIE } from "@/lib/access-codes";
import { getValidAccessCode } from "@/lib/access-codes-server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase-middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const isResetPasswordRoute = pathname === "/admin/reset-password";
  const isPropertiesRoute = pathname.startsWith("/properties");

  if (isAdminRoute) {
    const { supabase, response } = createSupabaseMiddlewareClient(request);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user && !isLoginRoute && !isResetPasswordRoute) {
      const loginUrl = new URL("/admin/login", request.url);

      return NextResponse.redirect(loginUrl);
    }

    if (user && isLoginRoute) {
      const dashboardUrl = new URL("/admin/dashboard", request.url);

      return NextResponse.redirect(dashboardUrl);
    }

    return response;
  }

  if (isPropertiesRoute) {
    const accessCode = request.cookies.get(VISITOR_ACCESS_COOKIE)?.value;

    if (!accessCode) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const validCode = await getValidAccessCode(accessCode);

    if (!validCode) {
      const response = NextResponse.redirect(new URL("/", request.url));

      response.cookies.delete(VISITOR_ACCESS_COOKIE);

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/properties/:path*"]
};
