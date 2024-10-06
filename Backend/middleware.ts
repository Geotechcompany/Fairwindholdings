import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    '/login(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/register(.*)',
    '/admin/login(.*)',
    '/user(.*)',
    '/api/webhooks/clerk'
  ],
  afterAuth(auth, req) {
    // Handle authenticated requests
    if (auth.userId) {
      // User is authenticated
      if (auth.isPublicRoute) {
        // If user is on a public route like /login or /sign-up, redirect to /trading-dashboard
        const path = req.nextUrl.pathname;
        if (path === "/login" || path === "/sign-up") {
          return NextResponse.redirect(new URL("/trading-dashboard", req.url));
        }
      }
      
      // All authenticated users can access /trading-dashboard
      // No role check needed
    } else {
      // User is not authenticated
      if (!auth.isPublicRoute) {
        // If user is trying to access a protected route, redirect to /login
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Allow the request to continue
    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};