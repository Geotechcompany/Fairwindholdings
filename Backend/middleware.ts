<<<<<<< HEAD
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/login(.*)',

  '/sign-in(.*)',
  '/sign-up(.*)',
  '/register(.*)',
  '/admin/login(.*)'
])

export default clerkMiddleware((auth, request) => {
  const { userId } = auth()
  const isAuthRoute = request.nextUrl.pathname === '/trading-dashboard'
  const isTradingDashboardRoute = request.nextUrl.pathname === '/trading-dashboard'

  if (!isPublicRoute(request) && !isAuthRoute && !isTradingDashboardRoute) {
    auth().protect()
  }

  if (isAuthRoute && !userId) {
    return Response.redirect(new URL('/sign-in', request.url))
  }
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
=======
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/login(.*)',

  '/sign-in(.*)',
  '/sign-up(.*)',
  '/register(.*)',
  '/admin/login(.*)'
])

export default clerkMiddleware((auth, request) => {
  const { userId } = auth()
  const isAuthRoute = request.nextUrl.pathname === '/trading-dashboard'
  const isTradingDashboardRoute = request.nextUrl.pathname === '/trading-dashboard'

  if (!isPublicRoute(request) && !isAuthRoute && !isTradingDashboardRoute) {
    auth().protect()
  }

  if (isAuthRoute && !userId) {
    return Response.redirect(new URL('/sign-in', request.url))
  }
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
>>>>>>> c09caf01cf6b64f737834aabb94d702951eabaeb
};