import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/experiences",
  "/experiences/(.*)",
  "/api/webhook(.*)",
])

// Define role-specific routes
const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
])

const isHostRoute = createRouteMatcher([
  "/host(.*)",
  "/become-a-host",
])

const isAuthenticatedRoute = createRouteMatcher([
  "/dashboard",
  "/bookings(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  const role = sessionClaims?.metadata?.role || "traveler"

  // Allow public routes
  if (isPublicRoute(req)) return NextResponse.next()

  // Redirect unauthenticated users to sign-in
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Check admin routes
  if (isAdminRoute(req) && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Check host routes
  if (isHostRoute(req) && role !== "host" && role !== "admin") {
    // Allow access to become-a-host for travelers
    if (req.nextUrl.pathname === "/become-a-host" && role === "traveler") {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Check authenticated routes (available to all logged-in users)
  if (isAuthenticatedRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}