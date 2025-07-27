"use client"

import { useUser as useClerkUser } from "@clerk/nextjs"
import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { useEffect } from "react"
import { api } from "@/convex/_generated/api"

export function useUser() {
  const { isAuthenticated } = useConvexAuth()
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser()
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser)
  
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  )

  useEffect(() => {
    if (!isAuthenticated || !clerkLoaded || !clerkUser) return

    // Sync user data with Convex
    const syncUser = async () => {
      await createOrUpdateUser({
        clerkId: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
      })
    }

    if (!convexUser) {
      syncUser()
    }
  }, [isAuthenticated, clerkLoaded, clerkUser, convexUser, createOrUpdateUser])

  return {
    user: convexUser,
    isLoading: !clerkLoaded || (isAuthenticated && !convexUser),
    role: convexUser?.role || "traveler",
  }
}