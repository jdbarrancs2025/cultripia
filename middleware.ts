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
  const { userId, sessionClaims, getToken } = await auth()
  
  // Get the Convex token which includes publicMetadata
  let role = "traveler"
  try {
    const token = await getToken({ template: "convex" })
    if (token) {
      // Decode the JWT to get publicMetadata
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      role = payload.publicMetadata?.role || "traveler"
    }
  } catch (error) {
    // Fallback to sessionClaims if token fetch fails
    const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined
    role = publicMetadata?.role || "traveler"
  }

  // Allow public routes
  if (isPublicRoute(req)) return NextResponse.next()

  // Handle dashboard redirect based on role
  if (req.nextUrl.pathname === '/dashboard' && userId) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    } else if (role === 'host') {
      return NextResponse.redirect(new URL('/host/dashboard', req.url))
    }
    // Travelers stay on /dashboard (which maps to /(main)/dashboard)
  }

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