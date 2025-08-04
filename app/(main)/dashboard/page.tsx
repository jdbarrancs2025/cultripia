"use client";

import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations, useLocale } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookingWithDetails } from "@/types/booking";

export default function TravelerDashboard() {
  const { user, isLoaded } = useUser();
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [selectedTab, setSelectedTab] = useState("upcoming");

  // Get current user from Convex (conditional on user being loaded)
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );

  // Get traveler bookings
  const bookings = useQuery(
    api.bookings.getTravelerBookings,
    currentUser ? { travelerId: currentUser._id } : "skip",
  ) as BookingWithDetails[] | undefined;

  // Separate bookings into upcoming and past using useMemo for performance
  const { upcomingBookings, pastBookings } = useMemo(() => {
    if (!bookings) {
      return { upcomingBookings: [], pastBookings: [] };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming: BookingWithDetails[] = [];
    const past: BookingWithDetails[] = [];

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.selectedDate);
      if (bookingDate >= today) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    // Sort by date
    upcoming.sort(
      (a, b) =>
        new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime(),
    );
    past.sort(
      (a, b) =>
        new Date(b.selectedDate).getTime() - new Date(a.selectedDate).getTime(),
    );

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [bookings]);

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("subtitle")}
          </p>
        </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList
          className="grid w-full max-w-md grid-cols-2"
          aria-label={t("filterBookings")}
        >
          <TabsTrigger value="upcoming">
            {t("upcomingTab")} ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            {t("pastTab")} ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {t("noUpcomingBookings")}
                </p>
                <Button asChild>
                  <Link href="/experiences">{t("exploreExperiences")}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  isUpcoming={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  {t("noPastBookings")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  isUpcoming={false}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
    );
  } catch (error) {
    console.error("Dashboard render error:", error);
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading dashboard</h1>
          <p className="text-muted-foreground mb-4">
            Please refresh the page or contact support if the issue persists.
          </p>
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }
}

// Booking Card Component
function BookingCard({
  booking,
  isUpcoming,
}: {
  booking: BookingWithDetails;
  isUpcoming: boolean;
}) {
  const experience = booking.experience;
  const host = booking.host;
  const t = useTranslations("dashboard");
  const locale = useLocale();

  if (!experience || !host) {
    return null;
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={experience.imageUrl || "/placeholder.jpg"}
          alt={experience.titleEs}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isUpcoming && booking.paid && (
          <Badge className="absolute top-2 right-2 bg-green-600">
            {t("confirmed")}
          </Badge>
        )}
        {isUpcoming && !booking.paid && (
          <Badge className="absolute top-2 right-2 bg-yellow-600">
            {t("pendingPayment")}
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2" title={locale === "es" ? experience.titleEs : experience.titleEn}>
          {locale === "es" ? experience.titleEs : experience.titleEn}
        </CardTitle>
        <CardDescription>{t("host")}: {host.name}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span>
            {format(new Date(booking.selectedDate), "dd MMM yyyy", {
              locale: locale === "es" ? es : enUS,
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>{experience.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" aria-hidden="true" />
          <span>
            {booking.guestCount}{" "}
            {booking.guestCount === 1 ? t("person") : t("people")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold">
          <DollarSign className="h-4 w-4" aria-hidden="true" />
          <span>${booking.totalAmount} USD</span>
        </div>

        <div className="pt-3 space-y-2">
          {isUpcoming ? (
            <>
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/dashboard/bookings/${booking._id}`}>
                  {t("viewDetails")}
                </Link>
              </Button>
              {host.email && (
                <Button className="w-full" variant="secondary" asChild>
                  <a
                    href={`mailto:${host.email}`}
                    aria-label={`${t("sendEmailTo")}${host.name}`}
                  >
                    {t("contactHost")}
                  </a>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button className="w-full" asChild>
                <Link href={`/experiences/${experience._id}`}>
                  {t("bookAgain")}
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/dashboard/bookings/${booking._id}`}>
                  {t("viewDetails")}
                </Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
