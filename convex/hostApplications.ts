import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createApplication = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    location: v.string(),
    languagesSpoken: v.array(v.string()),
    experienceType: v.string(),
    experienceTitle: v.string(),
    experienceDescription: v.string(),
    maxGuests: v.number(),
    pricePerPerson: v.number(),
    availability: v.string(),
    specialRequirements: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate pricing
    if (args.pricePerPerson <= 0 || args.pricePerPerson > 1000) {
      throw new Error("Price per person must be between $1 and $1000");
    }

    // Validate max guests
    if (args.maxGuests < 1 || args.maxGuests > 20) {
      throw new Error("Max guests must be between 1 and 20");
    }

    // Validate string lengths
    if (args.name.length > 100 || args.name.length < 2) {
      throw new Error("Name must be between 2 and 100 characters");
    }

    if (args.email.length > 100 || !args.email.includes("@")) {
      throw new Error("Please provide a valid email address");
    }

    if (args.phone.length < 5 || args.phone.length > 20) {
      throw new Error("Please provide a valid phone number");
    }

    if (args.experienceTitle.length > 100 || args.experienceTitle.length < 5) {
      throw new Error("Experience title must be between 5 and 100 characters");
    }

    if (
      args.experienceDescription.length > 1000 ||
      args.experienceDescription.length < 20
    ) {
      throw new Error(
        "Experience description must be between 20 and 1000 characters",
      );
    }

    if (args.specialRequirements && args.specialRequirements.length > 500) {
      throw new Error("Special requirements must be less than 500 characters");
    }

    // Validate languages spoken
    if (args.languagesSpoken.length === 0) {
      throw new Error("Please select at least one language");
    }

    const validLanguages = [
      "spanish",
      "english",
      "french",
      "german",
      "italian",
      "portuguese",
      "kiche",
      "kaqchikel",
    ];
    const invalidLanguages = args.languagesSpoken.filter(
      (lang) => !validLanguages.includes(lang),
    );
    if (invalidLanguages.length > 0) {
      throw new Error("Invalid language selection");
    }

    // Validate location
    const validLocations = [
      "antigua",
      "lake-atitlan",
      "chichicastenango",
      "tikal",
      "semuc-champey",
      "guatemala-city",
      "quetzaltenango",
      "livingston",
    ];
    if (!validLocations.includes(args.location)) {
      throw new Error("Invalid location selection");
    }

    // Validate experience type
    const validTypes = [
      "cooking",
      "artisanal",
      "cultural",
      "nature",
      "historical",
      "spiritual",
      "agricultural",
      "textile",
    ];
    if (!validTypes.includes(args.experienceType)) {
      throw new Error("Invalid experience type");
    }

    // Validate availability
    const validAvailability = ["weekdays", "weekends", "flexible"];
    if (!validAvailability.includes(args.availability)) {
      throw new Error("Invalid availability selection");
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

    // Check if user already has a pending or approved application
    const existingApplication = await ctx.db
      .query("hostApplications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "approved"),
        ),
      )
      .first();

    if (existingApplication) {
      if (existingApplication.status === "pending") {
        throw new Error(
          "You already have a pending host application. Please wait for review.",
        );
      } else {
        throw new Error("You are already an approved host.");
      }
    }

    const applicationId = await ctx.db.insert("hostApplications", {
      userId: user._id,
      status: "pending",
      applicationData: {
        name: args.name,
        email: args.email,
        phone: args.phone,
        location: args.location,
        languages: args.languagesSpoken,
        experienceType: args.experienceType,
        experienceTitle: args.experienceTitle,
        description: args.experienceDescription,
        maxGuests: args.maxGuests,
        pricing: args.pricePerPerson,
        availability: args.availability,
        specialRequirements: args.specialRequirements,
      },
      createdAt: Date.now(),
    });

    return applicationId;
  },
});

export const getApplicationsByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
  },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("hostApplications")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();

    const applicationsWithUsers = await Promise.all(
      applications.map(async (app) => {
        const user = await ctx.db.get(app.userId);
        return {
          ...app,
          user, // user can be null if deleted
        };
      }),
    );

    return applicationsWithUsers;
  },
});

export const updateStatus = mutation({
  args: {
    applicationId: v.id("hostApplications"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error(
        "Unauthorized: Only admins can update application status",
      );
    }

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    await ctx.db.patch(args.applicationId, {
      status: args.status,
    });

    if (args.status === "approved") {
      // Role update will be handled separately via updateUserRole
    }
  },
});

export const getPendingApplicationsCount = query({
  handler: async (ctx) => {
    const pendingApplications = await ctx.db
      .query("hostApplications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return pendingApplications.length;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const applications = await ctx.db
      .query("hostApplications")
      .order("desc")
      .collect();

    return applications;
  },
});

export const getApplicationById = query({
  args: { applicationId: v.id("hostApplications") },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      return null;
    }

    return {
      ...application,
      applicantId: application.userId,
    };
  },
});
