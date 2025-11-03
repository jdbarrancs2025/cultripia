"use client";

import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
