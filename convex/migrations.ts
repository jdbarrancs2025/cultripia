import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const setDefaultCountryForExperiences = internalMutation({
  args: {},
  handler: async (ctx) => {
    const experiences = await ctx.db.query("experiences").collect();
    
    let updated = 0;
    for (const experience of experiences) {
      if (!experience.country) {
        await ctx.db.patch(experience._id, {
          country: "Guatemala"
        });
        updated++;
      }
    }
    
    // Updated experiences with default country
    return { updated };
  },
});

export const setDefaultCountryForHostApplications = internalMutation({
  args: {},
  handler: async (ctx) => {
    const applications = await ctx.db.query("hostApplications").collect();

    let updated = 0;
    for (const application of applications) {
      if (!application.applicationData.country) {
        await ctx.db.patch(application._id, {
          applicationData: {
            ...application.applicationData,
            country: "Guatemala"
          }
        });
        updated++;
      }
    }

    // Updated host applications with default country
    return { updated };
  },
});

/**
 * Migration to populate bookedGuests field in availability table
 * This should be run once after deploying the schema change
 *
 * For each availability record, calculates total guests from all bookings
 * on that date and updates the bookedGuests field
 */
export const migrateAvailabilityToCapacityBased = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting migration: Adding bookedGuests to availability records");

    // Get all availability records
    const allAvailability = await ctx.db.query("availability").collect();
    console.log(`Found ${allAvailability.length} availability records to migrate`);

    let updated = 0;
    let skipped = 0;

    for (const availability of allAvailability) {
      // Skip if already has bookedGuests field
      if (availability.bookedGuests !== undefined) {
        skipped++;
        continue;
      }

      // Get all paid bookings for this experience and date
      const allBookings = await ctx.db.query("bookings").collect();
      const dateBookings = allBookings.filter(
        (booking) =>
          booking.experienceId === availability.experienceId &&
          booking.selectedDate === availability.date &&
          booking.paid === true
      );

      // Calculate total guests
      const totalGuests = dateBookings.reduce(
        (sum, booking) => sum + booking.qtyPersons,
        0
      );

      // Update availability record
      await ctx.db.patch(availability._id, {
        bookedGuests: totalGuests,
      });

      updated++;

      if (updated % 100 === 0) {
        console.log(`Migrated ${updated} records...`);
      }
    }

    console.log(`Migration complete: ${updated} updated, ${skipped} skipped`);
    return { updated, skipped, total: allAvailability.length };
  },
});

/**
 * Helper mutation to verify migration results
 * Returns statistics about availability records
 */
export const checkAvailabilityMigrationStatus = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allAvailability = await ctx.db.query("availability").collect();

    const withBookedGuests = allAvailability.filter(
      (a) => a.bookedGuests !== undefined
    ).length;
    const withoutBookedGuests = allAvailability.filter(
      (a) => a.bookedGuests === undefined
    ).length;

    return {
      total: allAvailability.length,
      migrated: withBookedGuests,
      notMigrated: withoutBookedGuests,
      percentComplete: allAvailability.length > 0
        ? (withBookedGuests / allAvailability.length) * 100
        : 100,
    };
  },
});