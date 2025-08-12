"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Doc } from "@/convex/_generated/dataModel";
import { ExperienceHero } from "./ExperienceHero";
import { ExperienceInfo } from "./ExperienceInfo";
import { BookingCard } from "./BookingCard";
import { HostInfoCard } from "./HostInfoCard";

interface ExperienceDetailContentProps {
  experience: Doc<"experiences"> & {
    host: Doc<"users"> | null;
  };
}

export function ExperienceDetailContent({
  experience,
}: ExperienceDetailContentProps) {
  const locale = useLocale();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState(1);

  const totalAmount = guestCount * experience.priceUsd;
  const title = locale === "es" ? experience.titleEs : experience.titleEn;
  const description = locale === "es" ? experience.descEs : experience.descEn;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ExperienceHero
        imageUrl={experience.imageUrl}
        title={title}
        additionalImageUrls={experience.additionalImageUrls}
        youtubeVideoId={experience.youtubeVideoId}
      />

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ExperienceInfo
              title={title}
              description={description}
              location={experience.location}
              maxGuests={experience.maxGuests}
            />

            {experience.host && <HostInfoCard host={experience.host} />}
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingCard
                experienceId={experience._id}
                pricePerPerson={experience.priceUsd}
                maxGuests={experience.maxGuests}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                guestCount={guestCount}
                onGuestCountChange={setGuestCount}
                totalAmount={totalAmount}
                experienceTitle={title}
                hostName={experience.host?.name || "Host"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
