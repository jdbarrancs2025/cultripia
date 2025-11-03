"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function EditBlogPostPage() {
  const params = useParams();
  const postId = params.id as Id<"blogPosts">;
  const post = useQuery(api.blogPosts.getBlogPost, { postId });

  if (post === undefined) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (post === null) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Blog post not found. It may have been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <BlogPostForm
        initialData={{
          _id: post._id,
          titleEn: post.titleEn,
          titleEs: post.titleEs,
          contentEn: post.contentEn,
          contentEs: post.contentEs,
          excerptEn: post.excerptEn,
          excerptEs: post.excerptEs,
          slugEn: post.slugEn,
          slugEs: post.slugEs,
          featuredImageUrl: post.featuredImageUrl,
          status: post.status,
        }}
        isEditing
      />
    </div>
  );
}
