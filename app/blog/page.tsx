"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations, useLocale } from "next-intl";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function BlogListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("blog");
  const locale = useLocale() as "en" | "es";

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 12;

  const postsData = useQuery(api.blogPosts.listPublishedPosts, {
    locale,
    page: currentPage,
    pageSize,
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/blog?page=${newPage}`);
  };

  if (!postsData) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const { posts, totalPages, currentPage: activePage } = postsData;

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {t("description")}
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
              <BlogPostCard
                key={post._id}
                slug={locale === "en" ? post.slugEn : post.slugEs}
                title={locale === "en" ? post.titleEn : post.titleEs}
                excerpt={locale === "en" ? post.excerptEn : post.excerptEs}
                featuredImageUrl={post.featuredImageUrl}
                publishedAt={post.publishedAt}
                authorName={post.author?.name}
                locale={locale}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  {activePage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(activePage - 1);
                        }}
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first, last, current, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= activePage - 1 && page <= activePage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={page === activePage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (page === activePage - 2 || page === activePage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  {activePage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(activePage + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">{t("noPosts")}</p>
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense
        fallback={
          <div>
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          </div>
        }
      >
        <BlogListingContent />
      </Suspense>
    </div>
  );
}
