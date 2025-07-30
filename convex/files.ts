import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated")
    }

    // Check if user is a host
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()
    
    if (!user || (user.role !== "host" && user.role !== "admin")) {
      throw new Error("Unauthorized: Only hosts and admins can upload files")
    }

    // Generate a short-lived upload URL
    return await ctx.storage.generateUploadUrl()
  },
})

export const getUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  },
})