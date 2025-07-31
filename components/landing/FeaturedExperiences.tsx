"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ExperienceCard } from "@/components/ui/experience-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function FeaturedExperiences() {
  const experiences = useQuery(api.experiences.getExperiences, {
    status: "active",
  });

  const featuredExperiences = experiences?.slice(0, 3) || [];

  return (
    <section
      className="py-16 bg-gray-50"
      aria-labelledby="featured-experiences-title"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2
            id="featured-experiences-title"
            className="mb-4 text-3xl font-bold text-gris-90"
          >
            Experiencias Destacadas
          </h2>
          <p className="text-lg text-gris-80">
            Descubre nuestras experiencias más populares
          </p>
        </div>

        {!experiences ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="space-y-3 p-6">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : featuredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gris-80">
              No hay experiencias disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredExperiences.map((experience) => (
              <ExperienceCard
                key={experience._id}
                id={experience._id}
                title={experience.titleEs}
                description={experience.descEs}
                location={experience.location}
                maxGuests={experience.maxGuests}
                hostName={experience.host?.name || "Anfitrión"}
                priceUsd={experience.priceUsd}
                imageUrl={experience.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
