import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createAvailability = mutation({
  args: {
    experienceId: v.id("experiences"),
    date: v.string(),
    status: v.union(v.literal("available"), v.literal("blocked")),
  },
  handler: async (ctx, args) => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(args.date)) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD");
    }

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

    const experience = await ctx.db.get(args.experienceId);
    if (!experience) {
      throw new Error("Experience not found");
    }

    if (experience.hostId !== user._id && user.role !== "admin") {
      throw new Error(
        "Unauthorized: You can only manage availability for your own experiences",
      );
    }

    const existing = await ctx.db
      .query("availability")
      .withIndex("by_experience_date", (q) =>
        q.eq("experienceId", args.experienceId).eq("date", args.date),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { status: args.status });
      return existing._id;
    }

    const availabilityId = await ctx.db.insert("availability", {
      experienceId: args.experienceId,
      date: args.date,
      status: args.status,
    });

    return availabilityId;
  },
});

export const getAvailabilityByExperience = query({
  args: {
    experienceId: v.id("experiences"),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let availabilityRecords = await ctx.db
      .query("availability")
      .withIndex("by_experience", (q) =>
        q.eq("experienceId", args.experienceId),
      )
      .collect();

    if (args.startDate && args.endDate) {
      availabilityRecords = availabilityRecords.filter(
        (record) =>
          record.date >= args.startDate! && record.date <= args.endDate!,
      );
    }

    return availabilityRecords;
  },
});

export const updateAvailabilityStatus = mutation({
  args: {
    experienceId: v.id("experiences"),
    date: v.string(),
    status: v.union(
      v.literal("available"),
      v.literal("blocked"),
      v.literal("booked"),
    ),
  },
  handler: async (ctx, args) => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(args.date)) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD");
    }

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

    const experience = await ctx.db.get(args.experienceId);
    if (!experience) {
      throw new Error("Experience not found");
    }

    const availability = await ctx.db
      .query("availability")
      .withIndex("by_experience_date", (q) =>
        q.eq("experienceId", args.experienceId).eq("date", args.date),
      )
      .first();

    if (!availability) {
      if (
        args.status === "booked" ||
        (experience.hostId !== user._id && user.role !== "admin")
      ) {
        throw new Error("Unauthorized: Cannot update availability");
      }

      return await ctx.db.insert("availability", {
        experienceId: args.experienceId,
        date: args.date,
        status: args.status,
      });
    }

    if (args.status === "booked") {
      return;
    }

    if (experience.hostId !== user._id && user.role !== "admin") {
      throw new Error(
        "Unauthorized: You can only manage availability for your own experiences",
      );
    }

    await ctx.db.patch(availability._id, { status: args.status });
  },
});

export const bulkUpdateAvailability = mutation({
  args: {
    experienceId: v.id("experiences"),
    startDate: v.string(),
    endDate: v.string(),
    status: v.union(v.literal("available"), v.literal("blocked")),
  },
  handler: async (ctx, args) => {
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(args.startDate) || !dateRegex.test(args.endDate)) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD");
    }

    // Validate date range
    if (args.startDate > args.endDate) {
      throw new Error("Start date must be before end date");
    }

    // Validate future dates only
    const today = new Date().toISOString().split("T")[0];
    if (args.startDate < today) {
      throw new Error("Cannot modify past dates");
    }

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

    const experience = await ctx.db.get(args.experienceId);
    if (!experience) {
      throw new Error("Experience not found");
    }

    if (experience.hostId !== user._id && user.role !== "admin") {
      throw new Error(
        "Unauthorized: You can only manage availability for your own experiences",
      );
    }

    // Generate all dates in range
    const dates: string[] = [];
    const currentDate = new Date(args.startDate);
    const endDate = new Date(args.endDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Update each date
    const results = [];
    for (const date of dates) {
      const existing = await ctx.db
        .query("availability")
        .withIndex("by_experience_date", (q) =>
          q.eq("experienceId", args.experienceId).eq("date", date),
        )
        .first();

      if (existing) {
        // Don't update if it's already booked
        if (existing.status !== "booked") {
          await ctx.db.patch(existing._id, { status: args.status });
          results.push(existing._id);
        }
      } else {
        const id = await ctx.db.insert("availability", {
          experienceId: args.experienceId,
          date,
          status: args.status,
        });
        results.push(id);
      }
    }

    return { updated: results.length, dates };
  },
});

export const getAvailabilityForMonth = query({
  args: {
    experienceId: v.id("experiences"),
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    // Get experience details for max capacity
    const experience = await ctx.db.get(args.experienceId);
    if (!experience) {
      throw new Error("Experience not found");
    }

    // Calculate start and end dates for the month
    const startDate = new Date(args.year, args.month - 1, 1);
    const endDate = new Date(args.year, args.month, 0); // Last day of month

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    // Get all availability records for the date range
    const availabilityRecords = await ctx.db
      .query("availability")
      .withIndex("by_experience", (q) =>
        q.eq("experienceId", args.experienceId),
      )
      .collect();

    // Filter to month range
    const monthRecords = availabilityRecords.filter(
      (record) => record.date >= startDateStr && record.date <= endDateStr,
    );

    // Create a map of date to availability info
    const availabilityMap: Record<
      string,
      { status: "available" | "blocked" | "booked"; bookedGuests: number }
    > = {};
    monthRecords.forEach((record) => {
      availabilityMap[record.date] = {
        status: record.status,
        bookedGuests: record.bookedGuests ?? 0,
      };
    });

    // Generate all dates in the month with their status and capacity
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const availInfo = availabilityMap[dateStr] || {
        status: "available" as const,
        bookedGuests: 0,
      };

      const bookedGuests = availInfo.bookedGuests;
      const remainingCapacity = experience.maxGuests - bookedGuests;

      dates.push({
        date: dateStr,
        status: availInfo.status,
        dayOfWeek: currentDate.getDay(),
        dayOfMonth: currentDate.getDate(),
        bookedGuests,
        remainingCapacity,
        maxGuests: experience.maxGuests,
        isFull: bookedGuests >= experience.maxGuests,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      year: args.year,
      month: args.month,
      maxGuests: experience.maxGuests,
      dates,
    };
  },
});

/**
 * Get remaining capacity for a specific date
 */
export const getDateCapacity = query({
  args: {
    experienceId: v.id("experiences"),
    date: v.string(), // YYYY-MM-DD format
  },
  handler: async (ctx, args) => {
    const experience = await ctx.db.get(args.experienceId);
    if (!experience) {
      throw new Error("Experience not found");
    }

    const availability = await ctx.db
      .query("availability")
      .withIndex("by_experience_date", (q) =>
        q.eq("experienceId", args.experienceId).eq("date", args.date),
      )
      .first();

    const bookedGuests = availability?.bookedGuests ?? 0;
    const remainingCapacity = experience.maxGuests - bookedGuests;

    return {
      experienceId: args.experienceId,
      date: args.date,
      maxGuests: experience.maxGuests,
      bookedGuests,
      remainingCapacity,
      status: availability?.status ?? "available",
      isFull: bookedGuests >= experience.maxGuests,
    };
  },
});

/**
 * Get all bookings for a specific experience and date
 * Useful for hosts to see who booked their experience on a particular day
 */
export const getBookingsForDate = query({
  args: {
    experienceId: v.id("experiences"),
    date: v.string(), // YYYY-MM-DD format
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

    const experience = await ctx.db.get(args.experienceId);
    if (!experience) {
      throw new Error("Experience not found");
    }

    // Only host or admin can view bookings
    if (experience.hostId !== user._id && user.role !== "admin") {
      throw new Error("Unauthorized: Only the host can view these bookings");
    }

    // Get all bookings for this date
    const allBookings = await ctx.db.query("bookings").collect();
    const dateBookings = allBookings.filter(
      (booking) =>
        booking.experienceId === args.experienceId &&
        booking.selectedDate === args.date &&
        booking.paid === true
    );

    // Add traveler details
    const bookingsWithTravelers = await Promise.all(
      dateBookings.map(async (booking) => {
        const traveler = await ctx.db.get(booking.travelerId);
        return {
          ...booking,
          traveler,
        };
      })
    );

    const totalGuests = dateBookings.reduce(
      (sum, booking) => sum + booking.qtyPersons,
      0
    );

    return {
      bookings: bookingsWithTravelers,
      totalGuests,
      maxGuests: experience.maxGuests,
      remainingCapacity: experience.maxGuests - totalGuests,
    };
  },
});
