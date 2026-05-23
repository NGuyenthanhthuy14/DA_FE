import { NextRequest, NextResponse } from "next/server";

const privatePath = ["/cart"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = Boolean(request.cookies.get("refreshToken"));

  if (privatePath.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
