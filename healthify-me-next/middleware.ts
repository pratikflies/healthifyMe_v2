import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

export function middleware(request: any) {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get("accept");
  const token = request.cookies.get("token")?.value;
  const isAuthPage = url.pathname === "/";
  const notLoggedInUrl = new URL("/", request.url).toString();
  const homeUrl = new URL("/map", request.url).toString();

  // Check if the request accepts HTML, indicating it's a page request
  const isPageRequest = acceptHeader && acceptHeader.includes("text/html");

  // Redirect to home if already logged in and trying to access login/signup
  if (token && isAuthPage) {
    return NextResponse.redirect(homeUrl);
  }

  // Redirect to login if not logged in and trying to access protected routes
  if (!token && !isAuthPage && isPageRequest) {  // Only apply this logic to page requests
    return NextResponse.redirect(notLoggedInUrl);
  }

  // Continue with the request otherwise
  return NextResponse.next();
}