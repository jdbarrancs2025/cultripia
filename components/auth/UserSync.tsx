"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

export function UserSync() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      console.log("User synced to Convex:", user.email);
    }
  }, [user, isLoading]);

  // This component doesn't render anything
  return null;
}