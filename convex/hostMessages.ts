import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const sendHostMessage = mutation({
  args: {
    bookingId: v.id("bookings"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate message
    if (!args.message || args.message.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }

    // Get authenticated user
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

    // Get booking with details
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Get experience and verify ownership
    const experience = await ctx.db.get(booking.experienceId);
    if (!experience) {
      throw new Error("Experience not found");
    }

    if (experience.hostId !== user._id) {
      throw new Error(
        "Unauthorized: You can only send messages for your own experiences"
      );
    }

    // Get traveler details
    const traveler = await ctx.db.get(booking.travelerId);
    if (!traveler) {
      throw new Error("Traveler not found");
    }

    // Call the email API endpoint
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/emails/host-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            booking,
            experience,
            traveler,
            host: user,
            message: args.message,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Email API error:", errorText);
        throw new Error("Failed to send email");
      }

      const result = (await response.json()) as { success: boolean };
      return {
        success: true,
        emailSent: result.success,
      };
    } catch (error) {
      console.error("Error calling email API:", error);
      throw new Error("Failed to send message: " + (error as Error).message);
    }
  },
});
