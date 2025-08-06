import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createRequest = mutation({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Verify the user owns this booking
    if (booking.travelerId !== user._id) {
      throw new Error("Unauthorized: You can only cancel your own bookings");
    }

    // Check if a cancellation request already exists
    const existingRequest = await ctx.db
      .query("cancellationRequests")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .first();

    if (existingRequest) {
      throw new Error("A cancellation request already exists for this booking");
    }

    // Create the cancellation request
    const requestId = await ctx.db.insert("cancellationRequests", {
      bookingId: args.bookingId,
      requestedAt: Date.now(),
      processed: false,
    });

    return requestId;
  },
});

export const getRequests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      return [];
    }

    const requests = await ctx.db
      .query("cancellationRequests")
      .filter((q) => q.eq(q.field("processed"), false))
      .collect();

    // Get booking details for each request
    const requestsWithDetails = await Promise.all(
      requests.map(async (request) => {
        const booking = await ctx.db.get(request.bookingId);
        if (!booking) return null;

        const experience = await ctx.db.get(booking.experienceId);
        const traveler = await ctx.db.get(booking.travelerId);
        const host = experience ? await ctx.db.get(experience.hostId) : null;

        return {
          ...request,
          booking: {
            ...booking,
            experience,
            traveler,
            host,
          },
        };
      }),
    );

    // Filter out null values and sort by request date
    return requestsWithDetails
      .filter((r) => r !== null)
      .sort((a, b) => b.requestedAt - a.requestedAt);
  },
});

export const markProcessed = mutation({
  args: {
    requestId: v.id("cancellationRequests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can process cancellation requests");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Cancellation request not found");
    }

    await ctx.db.patch(args.requestId, { processed: true });

    return args.requestId;
  },
});

export const getPendingCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      return 0;
    }

    const requests = await ctx.db
      .query("cancellationRequests")
      .filter((q) => q.eq(q.field("processed"), false))
      .collect();

    return requests.length;
  },
});

export const getRequestForBooking = query({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      return null;
    }

    // Verify the user owns this booking or is admin/host
    if (booking.travelerId !== user._id && user.role !== "admin") {
      const experience = await ctx.db.get(booking.experienceId);
      if (!experience || experience.hostId !== user._id) {
        return null;
      }
    }

    const request = await ctx.db
      .query("cancellationRequests")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .first();

    return request;
  },
});