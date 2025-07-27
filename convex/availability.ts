import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createAvailability = mutation({
  args: {
    experienceId: v.id("experiences"),
    date: v.string(),
    status: v.union(v.literal("available"), v.literal("blocked")),
  },
  handler: async (ctx, args) => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(args.date)) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD")
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

    const experience = await ctx.db.get(args.experienceId)
    if (!experience) {
      throw new Error("Experience not found")
    }

    if (experience.hostId !== user._id) {
      throw new Error("Unauthorized: You can only manage availability for your own experiences")
    }

    const existing = await ctx.db
      .query("availability")
      .withIndex("by_experience_date", (q) => 
        q.eq("experienceId", args.experienceId).eq("date", args.date)
      )
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { status: args.status })
      return existing._id
    }

    const availabilityId = await ctx.db.insert("availability", {
      experienceId: args.experienceId,
      date: args.date,
      status: args.status,
    })
    
    return availabilityId
  },
})

export const getAvailabilityByExperience = query({
  args: {
    experienceId: v.id("experiences"),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let availabilityRecords = await ctx.db
      .query("availability")
      .withIndex("by_experience", (q) => q.eq("experienceId", args.experienceId))
      .collect()
    
    if (args.startDate && args.endDate) {
      availabilityRecords = availabilityRecords.filter(
        (record) => record.date >= args.startDate! && record.date <= args.endDate!
      )
    }
    
    return availabilityRecords
  },
})

export const updateAvailabilityStatus = mutation({
  args: {
    experienceId: v.id("experiences"),
    date: v.string(),
    status: v.union(v.literal("available"), v.literal("blocked"), v.literal("booked")),
  },
  handler: async (ctx, args) => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(args.date)) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD")
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

    const experience = await ctx.db.get(args.experienceId)
    if (!experience) {
      throw new Error("Experience not found")
    }

    const availability = await ctx.db
      .query("availability")
      .withIndex("by_experience_date", (q) => 
        q.eq("experienceId", args.experienceId).eq("date", args.date)
      )
      .first()

    if (!availability) {
      if (args.status === "booked" || experience.hostId !== user._id) {
        throw new Error("Unauthorized: Cannot update availability")
      }
      
      return await ctx.db.insert("availability", {
        experienceId: args.experienceId,
        date: args.date,
        status: args.status,
      })
    }

    if (args.status === "booked") {
      return
    }

    if (experience.hostId !== user._id) {
      throw new Error("Unauthorized: You can only manage availability for your own experiences")
    }

    await ctx.db.patch(availability._id, { status: args.status })
  },
})