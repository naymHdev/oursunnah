import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login"];
const PROTECTED_PREFIX = "/";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("dashboard-access-token")?.value;

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Already authenticated → redirect away from login
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  // Not authenticated → redirect to login
  if (!isPublic && pathname.startsWith(PROTECTED_PREFIX) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
