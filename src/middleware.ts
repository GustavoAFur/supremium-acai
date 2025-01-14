import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const { pathname, origin } = request.nextUrl;

  if (!token && (pathname.startsWith("/dashboard") || pathname === "/")) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  if (token && (pathname.startsWith("/login") || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
