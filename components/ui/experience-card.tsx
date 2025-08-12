"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MediaCarousel } from "@/components/ui/media-carousel";
import { MapPin, Users, User } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ExperienceCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  country?: string;
  maxGuests: number;
  hostName: string;
  priceUsd: number;
  imageUrl: string;
  additionalImageUrls?: string[];
  youtubeVideoId?: string;
}

export function ExperienceCard({
  id,
  title,
  description,
  location,
  country,
  maxGuests,
  hostName,
  priceUsd,
  imageUrl,
  additionalImageUrls,
  youtubeVideoId,
}: ExperienceCardProps) {
  const t = useTranslations("experiences");
  const tHome = useTranslations("home");
  return (
    <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
      <CardHeader className="p-0">
        <MediaCarousel
          primaryImage={imageUrl}
          additionalImages={additionalImageUrls}
          youtubeVideoId={youtubeVideoId}
          alt={title}
        />
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        <h3 className="line-clamp-2 text-xl font-semibold text-gris-90">
          {title}
        </h3>
        <p className="line-clamp-3 text-sm text-gris-80">{description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gris-80">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>{location}{country ? `, ${country}` : ""}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gris-80">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>{t("maxGuests")}: {maxGuests}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gris-80">
            <User className="h-4 w-4" aria-hidden="true" />
            <span>{tHome("host")}: {hostName}</span>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-2xl font-bold text-turquesa">${priceUsd}</span>
          <span className="text-sm text-gris-80"> {t("pricePerPerson")}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-turquesa hover:bg-turquesa/90">
          <Link href={`/experiences/${id}`}>{t("bookNow")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
