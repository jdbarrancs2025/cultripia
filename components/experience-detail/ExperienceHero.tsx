import { MediaCarousel } from "@/components/ui/media-carousel";

interface ExperienceHeroProps {
  imageUrl: string;
  title: string;
  additionalImageUrls?: string[];
  youtubeVideoId?: string;
}

export function ExperienceHero({ 
  imageUrl, 
  title, 
  additionalImageUrls, 
  youtubeVideoId 
}: ExperienceHeroProps) {
  return (
    <div className="relative h-[60vh] max-h-[600px] overflow-hidden bg-gray-900">
      <div className="h-full w-full">
        <MediaCarousel
          primaryImage={imageUrl}
          additionalImages={additionalImageUrls}
          youtubeVideoId={youtubeVideoId}
          alt={title}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
