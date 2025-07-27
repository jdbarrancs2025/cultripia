import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createBooking = mutation({
  args: {
    experienceId: v.id("experiences"),
    qtyPersons: v.number(),
    selectedDate: v.string(),
    stripeSessionId: v.string(),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate inputs
    if (args.qtyPersons <= 0) {
      throw new Error("Number of persons must be positive")
    }
    if (args.totalAmount < 0) {
      throw new Error("Total amount cannot be negative")
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(args.selectedDate)) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD")
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(args.selectedDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      throw new Error("Cannot book for past dates")
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

    if (args.qtyPersons > experience.maxGuests) {
      throw new Error("Number of guests exceeds maximum capacity")
    }

    const bookingId = await ctx.db.insert("bookings", {
      experienceId: args.experienceId,
      travelerId: user._id,
      qtyPersons: args.qtyPersons,
      selectedDate: args.selectedDate,
      stripeSessionId: args.stripeSessionId,
      paid: false,
      totalAmount: args.totalAmount,
      createdAt: Date.now(),
    })
    
    return bookingId
  },
})

export const getBookingsByTraveler = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()
    
    if (!user) {
      return []
    }

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_traveler", (q) => q.eq("travelerId", user._id))
      .collect()
    
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const experience = await ctx.db.get(booking.experienceId)
        const host = experience ? await ctx.db.get(experience.hostId) : null
        return {
          ...booking,
          experience,
          host,
        }
      })
    )
    
    return bookingsWithDetails
  },
})

export const getBookingsByExperience = query({
  args: { experienceId: v.id("experiences") },
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

    if (experience.hostId !== user._id && user.role !== "admin") {
      throw new Error("Unauthorized: You can only view bookings for your own experiences")
    }

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_experience", (q) => q.eq("experienceId", args.experienceId))
      .collect()
    
    const bookingsWithTravelers = await Promise.all(
      bookings.map(async (booking) => {
        const traveler = await ctx.db.get(booking.travelerId)
        return {
          ...booking,
          traveler, // traveler can be null if deleted
        }
      })
    )
    
    return bookingsWithTravelers
  },
})

export const updateBookingPaymentStatus = mutation({
  args: {
    stripeSessionId: v.string(),
    paid: v.boolean(),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_stripe_session", (q) => q.eq("stripeSessionId", args.stripeSessionId))
      .first()
    
    if (!booking) {
      throw new Error("Booking not found")
    }

    await ctx.db.patch(booking._id, { paid: args.paid })

    if (args.paid) {
      const availability = await ctx.db
        .query("availability")
        .withIndex("by_experience_date", (q) => 
          q.eq("experienceId", booking.experienceId).eq("date", booking.selectedDate)
        )
        .first()
      
      if (availability) {
        await ctx.db.patch(availability._id, { status: "booked" })
      } else {
        await ctx.db.insert("availability", {
          experienceId: booking.experienceId,
          date: booking.selectedDate,
          status: "booked",
        })
      }
    }
    
    return booking._id
  },
})