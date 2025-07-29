import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    role: v.union(v.literal("traveler"), v.literal("host"), v.literal("admin")),
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"]),

  hostApplications: defineTable({
    userId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    applicationData: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      location: v.string(),
      languages: v.array(v.string()),
      experienceType: v.string(),
      experienceTitle: v.string(),
      description: v.string(),
      maxGuests: v.number(),
      pricing: v.number(),
      availability: v.string(),
      specialRequirements: v.optional(v.string()),
    }),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_user", ["userId"]),

  experiences: defineTable({
    hostId: v.id("users"),
    titleEn: v.string(),
    titleEs: v.string(),
    descEn: v.string(),
    descEs: v.string(),
    location: v.string(),
    maxGuests: v.number(),
    priceUsd: v.number(),
    imageUrl: v.string(),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("inactive")),
    originalLanguage: v.optional(v.union(v.literal("EN"), v.literal("ES"))),
    createdAt: v.number(),
  })
    .index("by_host", ["hostId"])
    .index("by_status", ["status"])
    .index("by_location", ["location"]),

  availability: defineTable({
    experienceId: v.id("experiences"),
    date: v.string(), // YYYY-MM-DD format
    status: v.union(v.literal("available"), v.literal("blocked"), v.literal("booked")),
  })
    .index("by_experience", ["experienceId"])
    .index("by_date", ["date"])
    .index("by_experience_date", ["experienceId", "date"]),

  bookings: defineTable({
    experienceId: v.id("experiences"),
    travelerId: v.id("users"),
    qtyPersons: v.number(),
    selectedDate: v.string(), // YYYY-MM-DD format
    stripeSessionId: v.string(),
    paid: v.boolean(),
    totalAmount: v.number(),
    createdAt: v.number(),
  })
    .index("by_experience", ["experienceId"])
    .index("by_traveler", ["travelerId"])
    .index("by_date", ["selectedDate"])
    .index("by_stripe_session", ["stripeSessionId"]),
})