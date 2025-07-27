import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// @deprecated Use createOrUpdateUser instead
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()
    
    if (existing) {
      return existing._id
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      role: "traveler",
      createdAt: Date.now(),
    })
    
    return userId
  },
})

export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()

    if (existingUser) {
      return existingUser._id
    }

    // Create new user with default traveler role
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      role: "traveler",
      createdAt: Date.now(),
    })
  },
})

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()
  },
})

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("traveler"), v.literal("host"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    // Get the current user from auth
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated")
    }

    // Get the current user's role
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()
    
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update user roles")
    }

    // Update the user role
    await ctx.db.patch(args.userId, { role: args.role })
  },
})

export const getAdminUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect()
  },
})