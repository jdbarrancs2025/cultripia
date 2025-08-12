"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getYouTubeEmbedUrl, defaultYouTubeIframeProps } from "@/lib/youtube-embed";

interface MediaCarouselProps {
  primaryImage: string;
  additionalImages?: string[];
  youtubeVideoId?: string;
  alt: string;
}

export function MediaCarousel({
  primaryImage,
  additionalImages = [],
  youtubeVideoId,
  alt,
}: MediaCarouselProps) {
  // Combine all media items
  const allImages = [primaryImage, ...additionalImages];
  const hasMultipleMedia = allImages.length > 1 || youtubeVideoId;

  // If only single image and no video, render static image
  if (!hasMultipleMedia) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={primaryImage || "/images/placeholder-experience.svg"}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  // Render carousel with multiple media items
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {/* Primary and additional images */}
        {allImages.map((imageUrl, index) => (
          <CarouselItem key={`image-${index}`}>
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={imageUrl || "/images/placeholder-experience.svg"}
                alt={`${alt} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CarouselItem>
        ))}
        
        {/* YouTube video if provided */}
        {youtubeVideoId && (
          <CarouselItem key="youtube-video">
            <div className="relative aspect-video w-full overflow-hidden">
              <iframe
                src={getYouTubeEmbedUrl(youtubeVideoId)}
                title={`${alt} - Video`}
                className="h-full w-full"
                {...defaultYouTubeIframeProps}
              />
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
      
      {/* Navigation controls - only show when multiple media items */}
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}