import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface BlogPostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl?: string;
  publishedAt?: number;
  authorName?: string;
  locale: "en" | "es";
}

export function BlogPostCard({
  slug,
  title,
  excerpt,
  featuredImageUrl,
  publishedAt,
  authorName,
  locale,
}: BlogPostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {featuredImageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={featuredImageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <h3 className="text-xl font-semibold line-clamp-2 hover:text-turquesa transition-colors">
            {title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {authorName && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{authorName}</span>
              </div>
            )}
            {publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(publishedAt), {
                    addSuffix: true,
                    locale: locale === "es" ? es : enUS,
                  })}
                </span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
