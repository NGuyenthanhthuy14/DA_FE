import { NextRequest, NextResponse } from "next/server"


const privatePath = ["/cart"];

const authPath = ["/auth/login", "/auth/register"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	const isAuth = Boolean(request.cookies.get("refreshToken"))

	// chưa đăng nập thì k cho vào private path, còn public path thì cho vào
	if (privatePath.some((path) => pathname.startsWith(path)) && !isAuth) {
		return NextResponse.redirect(new URL("/auth/login", request.nextUrl))
	}

	// đã đăng nhập thì k cho vào auth path, còn public path thì cho vào
  if (authPath.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }
	return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};