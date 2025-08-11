import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes (no authentication required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/experiences",
  "/experiences/(.*)",
  "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) return NextResponse.next();

  // Redirect unauthenticated users to sign-in for protected routes
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Handle dashboard redirect based on role (convenience routing only)
  // This is optional - just helps users get to their default dashboard
  if (req.nextUrl.pathname === "/dashboard") {
    const publicMetadata = sessionClaims?.publicMetadata as
      | { role?: string }
      | undefined;
    const role = publicMetadata?.role || "traveler";
    
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (role === "host") {
      return NextResponse.redirect(new URL("/host/dashboard", req.url));
    }
    // Travelers stay on /dashboard (which maps to /(main)/dashboard)
  }

  // Allow all authenticated users to access any route
  // Pages will handle role-based authorization themselves
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
