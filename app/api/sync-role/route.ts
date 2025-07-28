import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Convex
    const convexUser = await convex.query(api.users.getUserByClerkId, { clerkId: userId });
    
    if (!convexUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Update Clerk metadata with Convex role
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: convexUser.role
      }
    });

    return NextResponse.json({ 
      success: true, 
      role: convexUser.role,
      message: `Role synced: ${convexUser.role}` 
    });
  } catch (error) {
    console.error("Error syncing role:", error);
    return NextResponse.json(
      { error: "Failed to sync role" }, 
      { status: 500 }
    );
  }
}