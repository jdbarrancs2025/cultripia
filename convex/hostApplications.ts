import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createApplication = mutation({
  args: {
    phone: v.string(),
    location: v.string(),
    languages: v.array(v.string()),
    experienceType: v.string(),
    description: v.string(),
    pricing: v.number(),
    availability: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate pricing is positive
    if (args.pricing <= 0) {
      throw new Error("Pricing must be a positive number")
    }
    
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()
    
    if (!user) {
      throw new Error("User not found")
    }

    const applicationId = await ctx.db.insert("hostApplications", {
      userId: user._id,
      status: "pending",
      applicationData: {
        phone: args.phone,
        location: args.location,
        languages: args.languages,
        experienceType: args.experienceType,
        description: args.description,
        pricing: args.pricing,
        availability: args.availability,
      },
      createdAt: Date.now(),
    })
    
    return applicationId
  },
})

export const getApplicationsByStatus = query({
  args: { status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")) },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("hostApplications")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect()
    
    const applicationsWithUsers = await Promise.all(
      applications.map(async (app) => {
        const user = await ctx.db.get(app.userId)
        return {
          ...app,
          user, // user can be null if deleted
        }
      })
    )
    
    return applicationsWithUsers
  },
})

export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("hostApplications"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated")
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()
    
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update application status")
    }

    const application = await ctx.db.get(args.applicationId)
    if (!application) {
      throw new Error("Application not found")
    }

    await ctx.db.patch(args.applicationId, {
      status: args.status,
    })

    if (args.status === "approved") {
      await ctx.db.patch(application.userId, {
        role: "host",
      })
    }
  },
})