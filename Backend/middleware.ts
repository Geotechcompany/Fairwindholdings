import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === "/admin/login";
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return null;
    }

    if (!isAuth && isAdminPage) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    if (isAdminPage && token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
