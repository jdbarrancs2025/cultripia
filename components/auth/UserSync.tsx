"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";

export function UserSync() {
  const { user, isLoading } = useUser();
  const { user: clerkUser } = useClerkUser();

  useEffect(() => {
    if (!isLoading && user) {
      console.log("User synced to Convex:", user.email);
      
      // Sync role to Clerk if it doesn't match
      if (clerkUser && user.role !== clerkUser.publicMetadata?.role) {
        console.log("Syncing role to Clerk:", user.role);
        fetch("/api/sync-role", { method: "POST" })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              console.log("Role synced successfully:", data.role);
              // Reload to apply new role permissions
              window.location.reload();
            }
          })
          .catch(err => console.error("Failed to sync role:", err));
      }
    }
  }, [user, isLoading, clerkUser]);

  // This component doesn't render anything
  return null;
}