import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new blog post
export const createBlogPost = mutation({
  args: {
    titleEn: v.string(),
    titleEs: v.string(),
    contentEn: v.string(),
    contentEs: v.string(),
    excerptEn: v.string(),
    excerptEs: v.string(),
    slugEn: v.string(),
    slugEs: v.string(),
    featuredImageStorageId: v.optional(v.id("_storage")),
    featuredImageUrl: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))
    ),
  },
  handler: async (ctx, args) => {
    // Validate inputs
    if (!args.titleEn.trim() || !args.titleEs.trim()) {
      throw new Error("Title is required in both languages");
    }
    if (!args.contentEn.trim() || !args.contentEs.trim()) {
      throw new Error("Content is required in both languages");
    }
    if (!args.excerptEn.trim() || !args.excerptEs.trim()) {
      throw new Error("Excerpt is required in both languages");
    }
    if (args.excerptEn.length > 200 || args.excerptEs.length > 200) {
      throw new Error("Excerpt must be 200 characters or less");
    }
    if (!args.slugEn.trim() || !args.slugEs.trim()) {
      throw new Error("Slug is required in both languages");
    }

    // Check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create blog posts");
    }

    // Check for duplicate slugs
    const existingSlugEn = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug_en", (q) => q.eq("slugEn", args.slugEn))
      .first();

    const existingSlugEs = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug_es", (q) => q.eq("slugEs", args.slugEs))
      .first();

    if (existingSlugEn) {
      throw new Error("English slug already exists");
    }
    if (existingSlugEs) {
      throw new Error("Spanish slug already exists");
    }

    const now = Date.now();

    const postId = await ctx.db.insert("blogPosts", {
      titleEn: args.titleEn,
      titleEs: args.titleEs,
      contentEn: args.contentEn,
      contentEs: args.contentEs,
      excerptEn: args.excerptEn,
      excerptEs: args.excerptEs,
      slugEn: args.slugEn,
      slugEs: args.slugEs,
      featuredImageStorageId: args.featuredImageStorageId,
      featuredImageUrl: args.featuredImageUrl,
      status: args.status || "draft",
      publishedAt: args.status === "published" ? now : undefined,
      authorId: user._id,
      createdAt: now,
      updatedAt: now,
    });

    return postId;
  },
});

// Update an existing blog post
export const updateBlogPost = mutation({
  args: {
    postId: v.id("blogPosts"),
    titleEn: v.optional(v.string()),
    titleEs: v.optional(v.string()),
    contentEn: v.optional(v.string()),
    contentEs: v.optional(v.string()),
    excerptEn: v.optional(v.string()),
    excerptEs: v.optional(v.string()),
    slugEn: v.optional(v.string()),
    slugEs: v.optional(v.string()),
    featuredImageStorageId: v.optional(v.id("_storage")),
    featuredImageUrl: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))
    ),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update blog posts");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Blog post not found");
    }

    // Validate updated fields
    if (args.titleEn !== undefined && !args.titleEn.trim()) {
      throw new Error("English title cannot be empty");
    }
    if (args.titleEs !== undefined && !args.titleEs.trim()) {
      throw new Error("Spanish title cannot be empty");
    }
    if (args.contentEn !== undefined && !args.contentEn.trim()) {
      throw new Error("English content cannot be empty");
    }
    if (args.contentEs !== undefined && !args.contentEs.trim()) {
      throw new Error("Spanish content cannot be empty");
    }
    if (args.excerptEn !== undefined) {
      if (!args.excerptEn.trim()) {
        throw new Error("English excerpt cannot be empty");
      }
      if (args.excerptEn.length > 200) {
        throw new Error("English excerpt must be 200 characters or less");
      }
    }
    if (args.excerptEs !== undefined) {
      if (!args.excerptEs.trim()) {
        throw new Error("Spanish excerpt cannot be empty");
      }
      if (args.excerptEs.length > 200) {
        throw new Error("Spanish excerpt must be 200 characters or less");
      }
    }

    // Check for duplicate slugs (excluding current post)
    if (args.slugEn !== undefined) {
      if (!args.slugEn.trim()) {
        throw new Error("English slug cannot be empty");
      }
      const existingSlugEn = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug_en", (q) => q.eq("slugEn", args.slugEn!))
        .first();

      if (existingSlugEn && existingSlugEn._id !== args.postId) {
        throw new Error("English slug already exists");
      }
    }

    if (args.slugEs !== undefined) {
      if (!args.slugEs.trim()) {
        throw new Error("Spanish slug cannot be empty");
      }
      const existingSlugEs = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug_es", (q) => q.eq("slugEs", args.slugEs!))
        .first();

      if (existingSlugEs && existingSlugEs._id !== args.postId) {
        throw new Error("Spanish slug already exists");
      }
    }

    const { postId, ...updateData } = args;

    const updates: Record<string, any> = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // If status is being changed to published and wasn't published before, set publishedAt
    if (updateData.status === "published" && post.status !== "published") {
      updates.publishedAt = Date.now();
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(postId, updates);
  },
});

// Publish a blog post
export const publishBlogPost = mutation({
  args: {
    postId: v.id("blogPosts"),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can publish blog posts");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Blog post not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.postId, {
      status: "published",
      publishedAt: post.status !== "published" ? now : post.publishedAt,
      updatedAt: now,
    });
  },
});

// Delete a blog post
export const deleteBlogPost = mutation({
  args: {
    postId: v.id("blogPosts"),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can delete blog posts");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Blog post not found");
    }

    await ctx.db.delete(args.postId);
  },
});

// Get a single blog post by ID
export const getBlogPost = query({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      return null;
    }

    const author = await ctx.db.get(post.authorId);

    return {
      ...post,
      author,
    };
  },
});

// Get a blog post by slug (for public viewing)
export const getBlogPostBySlug = query({
  args: {
    slug: v.string(),
    locale: v.union(v.literal("en"), v.literal("es")),
  },
  handler: async (ctx, args) => {
    // Try to find post by English slug first
    let post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug_en", (q) => q.eq("slugEn", args.slug))
      .first();

    // If not found, try Spanish slug
    if (!post) {
      post = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug_es", (q) => q.eq("slugEs", args.slug))
        .first();
    }

    if (!post) {
      return null;
    }

    const author = await ctx.db.get(post.authorId);

    return {
      ...post,
      author,
    };
  },
});

// List all blog posts (for admin)
export const listBlogPosts = query({
  args: {
    status: v.optional(
      v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))
    ),
  },
  handler: async (ctx, args) => {
    let posts;

    if (args.status) {
      posts = await ctx.db
        .query("blogPosts")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      posts = await ctx.db.query("blogPosts").collect();
    }

    // Sort by updatedAt descending (most recent first)
    posts.sort((a, b) => b.updatedAt - a.updatedAt);

    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          author,
        };
      })
    );

    return postsWithAuthors;
  },
});

// List published posts (for public viewing) with pagination
export const listPublishedPosts = query({
  args: {
    locale: v.union(v.literal("en"), v.literal("es")),
    page: v.number(),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pageSize = args.pageSize || 12;
    const offset = (args.page - 1) * pageSize;

    // Get all published posts
    const allPosts = await ctx.db
      .query("blogPosts")
      .withIndex("by_published", (q) =>
        q.eq("status", "published").gt("publishedAt", 0)
      )
      .collect();

    // Sort by publishedAt descending (most recent first)
    allPosts.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));

    const totalCount = allPosts.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Get paginated results
    const paginatedPosts = allPosts.slice(offset, offset + pageSize);

    // Fetch author details
    const postsWithAuthors = await Promise.all(
      paginatedPosts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          author,
        };
      })
    );

    return {
      posts: postsWithAuthors,
      totalCount,
      totalPages,
      currentPage: args.page,
      pageSize,
    };
  },
});
