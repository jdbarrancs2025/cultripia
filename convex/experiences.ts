import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createExperience = mutation({
  args: {
    titleEn: v.string(),
    titleEs: v.string(),
    descEn: v.string(),
    descEs: v.string(),
    location: v.string(),
    maxGuests: v.number(),
    priceUsd: v.number(),
    imageUrl: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    // Validate inputs
    if (args.maxGuests <= 0) {
      throw new Error("Maximum guests must be a positive number")
    }
    if (args.priceUsd < 0) {
      throw new Error("Price cannot be negative")
    }
    
    // Validate required fields are not empty
    if (!args.titleEn.trim() || !args.titleEs.trim()) {
      throw new Error("Title is required in both languages")
    }
    if (!args.descEn.trim() || !args.descEs.trim()) {
      throw new Error("Description is required in both languages")
    }
    if (!args.location.trim()) {
      throw new Error("Location is required")
    }
    if (!args.imageUrl.trim()) {
      throw new Error("Image URL is required")
    }
    
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()
    
    if (!user || user.role !== "host") {
      throw new Error("Unauthorized: Only hosts can create experiences")
    }

    const experienceId = await ctx.db.insert("experiences", {
      hostId: user._id,
      titleEn: args.titleEn,
      titleEs: args.titleEs,
      descEn: args.descEn,
      descEs: args.descEs,
      location: args.location,
      maxGuests: args.maxGuests,
      priceUsd: args.priceUsd,
      imageUrl: args.imageUrl,
      status: args.status || "draft",
      createdAt: Date.now(),
    })
    
    return experienceId
  },
})

export const getExperiences = query({
  args: {
    location: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("inactive"))),
    hostId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let experiences
    
    if (args.location) {
      experiences = await ctx.db
        .query("experiences")
        .withIndex("by_location", (q) => q.eq("location", args.location!))
        .collect()
    } else if (args.status) {
      experiences = await ctx.db
        .query("experiences")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect()
    } else if (args.hostId) {
      experiences = await ctx.db
        .query("experiences")
        .withIndex("by_host", (q) => q.eq("hostId", args.hostId!))
        .collect()
    } else {
      experiences = await ctx.db.query("experiences").collect()
    }
    
    const experiencesWithHosts = await Promise.all(
      experiences.map(async (exp) => {
        const host = await ctx.db.get(exp.hostId)
        return {
          ...exp,
          host, // host can be null if deleted
        }
      })
    )
    
    return experiencesWithHosts.filter((exp) => {
      if (args.location && exp.location !== args.location) return false
      if (args.status && exp.status !== args.status) return false
      if (args.hostId && exp.hostId !== args.hostId) return false
      return true
    })
  },
})

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("experiences").collect()
  },
})

export const getExperiencesPaginated = query({
  args: {
    location: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("inactive"))),
    page: v.number(),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pageSize = args.pageSize || 12
    const offset = (args.page - 1) * pageSize
    
    // Build query based on filters
    let allExperiences
    
    if (args.location && args.status) {
      // Both filters: need to fetch all and filter manually
      allExperiences = await ctx.db
        .query("experiences")
        .withIndex("by_location", (q) => q.eq("location", args.location!))
        .collect()
      allExperiences = allExperiences.filter(exp => exp.status === args.status)
    } else if (args.location) {
      // Location filter only
      allExperiences = await ctx.db
        .query("experiences")
        .withIndex("by_location", (q) => q.eq("location", args.location!))
        .collect()
    } else if (args.status) {
      // Status filter only
      allExperiences = await ctx.db
        .query("experiences")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect()
    } else {
      // No filters
      allExperiences = await ctx.db
        .query("experiences")
        .collect()
    }
    
    const totalCount = allExperiences.length
    const totalPages = Math.ceil(totalCount / pageSize)
    
    // Get paginated results
    const paginatedExperiences = allExperiences.slice(offset, offset + pageSize)
    
    // Fetch host details
    const experiencesWithHosts = await Promise.all(
      paginatedExperiences.map(async (exp) => {
        const host = await ctx.db.get(exp.hostId)
        return {
          ...exp,
          host,
        }
      })
    )
    
    return {
      experiences: experiencesWithHosts,
      totalCount,
      totalPages,
      currentPage: args.page,
      pageSize,
    }
  },
})

export const updateExperience = mutation({
  args: {
    experienceId: v.id("experiences"),
    titleEn: v.optional(v.string()),
    titleEs: v.optional(v.string()),
    descEn: v.optional(v.string()),
    descEs: v.optional(v.string()),
    location: v.optional(v.string()),
    maxGuests: v.optional(v.number()),
    priceUsd: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
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
      throw new Error("Unauthorized: You can only update your own experiences")
    }

    const { experienceId, ...updateData } = args
    
    // Validate updated fields
    if (updateData.maxGuests !== undefined && updateData.maxGuests <= 0) {
      throw new Error("Maximum guests must be a positive number")
    }
    if (updateData.priceUsd !== undefined && updateData.priceUsd < 0) {
      throw new Error("Price cannot be negative")
    }
    if (updateData.titleEn !== undefined && !updateData.titleEn.trim()) {
      throw new Error("English title cannot be empty")
    }
    if (updateData.titleEs !== undefined && !updateData.titleEs.trim()) {
      throw new Error("Spanish title cannot be empty")
    }
    if (updateData.descEn !== undefined && !updateData.descEn.trim()) {
      throw new Error("English description cannot be empty")
    }
    if (updateData.descEs !== undefined && !updateData.descEs.trim()) {
      throw new Error("Spanish description cannot be empty")
    }
    if (updateData.location !== undefined && !updateData.location.trim()) {
      throw new Error("Location cannot be empty")
    }
    if (updateData.imageUrl !== undefined && !updateData.imageUrl.trim()) {
      throw new Error("Image URL cannot be empty")
    }
    
    const updates = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    )

    await ctx.db.patch(experienceId, updates)
  },
})

export const getExperience = query({
  args: { id: v.id("experiences") },
  handler: async (ctx, args) => {
    const experience = await ctx.db.get(args.id)
    if (!experience) {
      return null
    }

    const host = await ctx.db.get(experience.hostId)
    
    return {
      ...experience,
      host,
    }
  },
})