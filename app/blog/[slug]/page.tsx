"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useLocale } from "next-intl";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale() as "en" | "es";

  const post = useQuery(api.blogPosts.getBlogPostBySlug, { slug, locale });

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === "en" ? "Back to Blog" : "Volver al Blog"}
            </Button>
          </Link>
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!post || post.status !== "published") {
    notFound();
  }

  const title = locale === "en" ? post.titleEn : post.titleEs;
  const content = locale === "en" ? post.contentEn : post.contentEs;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === "en" ? "Back to Blog" : "Volver al Blog"}
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImageUrl}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{post.author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <time dateTime={new Date(post.publishedAt).toISOString()}>
                    {format(new Date(post.publishedAt), "MMMM d, yyyy", {
                      locale: locale === "es" ? es : enUS,
                    })}
                  </time>
                  <span className="text-sm">
                    (
                    {formatDistanceToNow(new Date(post.publishedAt), {
                      addSuffix: true,
                      locale: locale === "es" ? es : enUS,
                    })}
                    )
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <BlogPostContent content={content} />
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === "en" ? "Back to all posts" : "Volver a todos los artículos"}
              </Button>
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
