"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function useUser() {
  const { isAuthenticated } = useConvexAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip",
  );

  useEffect(() => {
    if (!isAuthenticated || !clerkLoaded || !clerkUser) return;

    // Sync user data with Convex
    const syncUser = async () => {
      try {
        await createOrUpdateUser({
          clerkId: clerkUser.id,
          name: clerkUser.fullName || clerkUser.firstName || "User",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
        });
        console.log("User synced successfully:", clerkUser.id);
      } catch (error) {
        console.error("Failed to sync user to Convex:", error);
        console.error("User details:", {
          clerkId: clerkUser.id,
          name: clerkUser.fullName || clerkUser.firstName || "User",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
        });
      }
    };

    if (!convexUser) {
      syncUser();
    }
  }, [isAuthenticated, clerkLoaded, clerkUser, convexUser, createOrUpdateUser]);

  // Sync role with Clerk if there's a mismatch
  useEffect(() => {
    if (
      convexUser &&
      clerkUser &&
      convexUser.role !== clerkUser.publicMetadata?.role
    ) {
      fetch("/api/sync-role", { method: "POST" }).catch((err) =>
        console.error("Failed to sync role:", err),
      );
    }
  }, [convexUser, clerkUser]);

  return {
    user: convexUser,
    isLoading: !clerkLoaded || (isAuthenticated && !convexUser),
    role:
      convexUser?.role ||
      (clerkUser?.publicMetadata?.role as string) ||
      "traveler",
  };
}
