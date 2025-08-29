import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSupportRequest = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: Implement rate limiting to prevent spam
    // Consider limiting to 5 requests per email per hour
    // or implementing CAPTCHA for production
    
    // Input validation and sanitization
    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    const message = args.message.trim();

    // Validate input lengths
    if (name.length === 0 || name.length > 100) {
      throw new Error("Name must be between 1 and 100 characters");
    }
    
    if (email.length === 0 || email.length > 255) {
      throw new Error("Email must be between 1 and 255 characters");
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    
    if (message.length < 10 || message.length > 5000) {
      throw new Error("Message must be between 10 and 5000 characters");
    }

    const supportRequestId = await ctx.db.insert("supportRequests", {
      name,
      email,
      message,
      status: "pending",
      createdAt: Date.now(),
    });

    return supportRequestId;
  },
});

export const listSupportRequests = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("resolved"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Not authorized");
    }

    if (args.status) {
      const status = args.status;
      const requests = await ctx.db
        .query("supportRequests")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect();
      return requests;
    } else {
      const requests = await ctx.db
        .query("supportRequests")
        .order("desc")
        .collect();
      return requests;
    }
  },
});

export const updateSupportStatus = mutation({
  args: {
    requestId: v.id("supportRequests"),
    status: v.union(v.literal("pending"), v.literal("resolved")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const updateData: {
      status: "pending" | "resolved";
      resolvedAt?: number;
    } = {
      status: args.status,
    };

    if (args.status === "resolved") {
      updateData.resolvedAt = Date.now();
    }

    await ctx.db.patch(args.requestId, updateData);
  },
});

export const getSupportRequestStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const allRequests = await ctx.db.query("supportRequests").collect();
    
    const pending = allRequests.filter(r => r.status === "pending").length;
    const resolved = allRequests.filter(r => r.status === "resolved").length;

    return {
      total: allRequests.length,
      pending,
      resolved,
    };
  },
});