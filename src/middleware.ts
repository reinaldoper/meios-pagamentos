
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get("__session")?.value;
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

  if (!isAuth && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
