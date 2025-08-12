"use client";

import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaCarousel } from "@/components/ui/media-carousel";
import { Images, Video } from "lucide-react";

interface ExperienceMediaGalleryProps {
  title: string;
  additionalImageUrls?: string[];
  youtubeVideoId?: string;
}

export function ExperienceMediaGallery({
  title,
  additionalImageUrls = [],
  youtubeVideoId,
}: ExperienceMediaGalleryProps) {
  const locale = useLocale();
  
  // Don't render if no additional media
  if (!additionalImageUrls.length && !youtubeVideoId) {
    return null;
  }

  const galleryTitle = locale === "es" ? "Galería de Medios" : "Media Gallery";
  const hasImages = additionalImageUrls.length > 0;
  const hasVideo = !!youtubeVideoId;

  return (
    <Card className="border-turquesa/20 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gris-90">
          {hasImages && <Images className="h-5 w-5 text-turquesa" />}
          {hasVideo && <Video className="h-5 w-5 text-turquesa" />}
          {galleryTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-xl overflow-hidden">
          <MediaCarousel
            primaryImage={additionalImageUrls[0] || ""}
            additionalImages={additionalImageUrls.slice(1)}
            youtubeVideoId={youtubeVideoId}
            alt={`${title} - ${galleryTitle}`}
          />
        </div>
        {hasImages && hasVideo && (
          <div className="mt-3 text-sm text-gris-80 text-center">
            {locale === "es" 
              ? `${additionalImageUrls.length} imagen${additionalImageUrls.length > 1 ? 'es' : ''} y 1 video`
              : `${additionalImageUrls.length} image${additionalImageUrls.length > 1 ? 's' : ''} and 1 video`
            }
          </div>
        )}
        {hasImages && !hasVideo && (
          <div className="mt-3 text-sm text-gris-80 text-center">
            {locale === "es" 
              ? `${additionalImageUrls.length} imagen${additionalImageUrls.length > 1 ? 'es adicionales' : ' adicional'}`
              : `${additionalImageUrls.length} additional image${additionalImageUrls.length > 1 ? 's' : ''}`
            }
          </div>
        )}
        {!hasImages && hasVideo && (
          <div className="mt-3 text-sm text-gris-80 text-center">
            {locale === "es" ? "Video de la experiencia" : "Experience video"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}