import { v } from "convex/values";
import { query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const getHostMetrics = query({
  args: { hostId: v.id("users") },
  handler: async (ctx, args) => {
    // Verify the host exists
    const host = await ctx.db.get(args.hostId);
    if (!host || (host.role !== "host" && host.role !== "admin")) {
      throw new Error("Usuario no es anfitrión");
    }

    // Get all experiences by this host
    const experiences = await ctx.db
      .query("experiences")
      .filter((q) => q.eq(q.field("hostId"), args.hostId))
      .collect();

    // Get all bookings for host's experiences
    const experienceIds = experiences.map((exp) => exp._id);
    const bookings: Doc<"bookings">[] = [];

    for (const expId of experienceIds) {
      const expBookings = await ctx.db
        .query("bookings")
        .filter((q) => q.eq(q.field("experienceId"), expId))
        .collect();
      bookings.push(...expBookings);
    }

    // Calculate metrics
    const totalBookings = bookings.length;
    const paidBookings = bookings.filter((b) => b.paid);
    const totalRevenue = paidBookings.reduce(
      (sum, b) => sum + b.totalAmount,
      0,
    );

    // Calculate monthly revenue
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRevenue = paidBookings
      .filter((b) => {
        const bookingDate = new Date(b.createdAt);
        return (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // Count upcoming bookings
    const today = now.toISOString().split("T")[0];
    const upcomingBookings = bookings.filter(
      (b) => b.selectedDate >= today,
    ).length;

    return {
      totalBookings,
      totalRevenue,
      monthlyRevenue,
      upcomingBookings,
      activeExperiences: experiences.filter((e) => e.status === "active")
        .length,
      totalExperiences: experiences.length,
    };
  },
});
