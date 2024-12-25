import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const runtime = "nodejs"; // Explicitly set the runtime to Node.js

const protectedRoutes = ["/dashboard", "/imageUpload"];

export default async function middleware(req: Request) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || "",
  });

  const isLoggedIn = !!token; // Check if the token exists
  const url = new URL(req.url);
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to homepage if not authenticated
  }

  return NextResponse.next(); // Proceed if authenticated or route is not protected
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
