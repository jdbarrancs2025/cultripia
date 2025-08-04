"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Users, MapPin, Mail } from "lucide-react";
import Link from "next/link";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("bookingSuccess");
  const locale = useLocale();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);

  const booking = useQuery(
    api.bookings.getBySessionId,
    sessionId ? { sessionId } : "skip",
  );

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (booking !== undefined) {
      setIsLoading(false);
    }
  }, [booking]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-turquesa border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">{t("confirmingBooking")}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">{t("bookingNotFound")}</p>
            <Button asChild>
              <Link href="/">{t("backToHome")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString(locale === "en" ? "en-US" : "es", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("bookingConfirmed")}
          </h1>
          <p className="text-gray-600">
            {t("paymentProcessedSuccessfully")}
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("bookingDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Experience Info */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {locale === "es" ? booking.experience?.titleEs : booking.experience?.titleEn}
              </h3>
              <p className="text-gray-600">{locale === "es" ? booking.experience?.descEs : booking.experience?.descEn}</p>
            </div>

            {/* Booking Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-turquesa mt-0.5" />
                <div>
                  <p className="font-medium">{t("date")}</p>
                  <p className="text-gray-600">
                    {formatDate(booking.selectedDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-turquesa mt-0.5" />
                <div>
                  <p className="font-medium">{t("numberOfPeople")}</p>
                  <p className="text-gray-600">
                    {booking.qtyPersons}{" "}
                    {booking.qtyPersons === 1 ? t("person") : t("people")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-turquesa mt-0.5" />
                <div>
                  <p className="font-medium">{t("location")}</p>
                  <p className="text-gray-600">
                    {booking.experience?.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-turquesa mt-0.5" />
                <div>
                  <p className="font-medium">{t("host")}</p>
                  <p className="text-gray-600">{booking.host?.name}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("totalPaid")}</span>
                <span className="text-2xl font-bold text-turquesa">
                  ${booking.totalAmount} USD
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{t("nextSteps")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-turquesa/10 text-turquesa flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">{t("checkEmail")}</p>
                <p className="text-sm text-gray-600">
                  {t("checkEmailDescription")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-turquesa/10 text-turquesa flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">{t("contactHost")}</p>
                <p className="text-sm text-gray-600">
                  {t("contactHostDescription")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-turquesa/10 text-turquesa flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">{t("enjoyExperience")}</p>
                <p className="text-sm text-gray-600">
                  {t("enjoyExperienceDescription")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">{t("viewMyBookings")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/experiences">{t("exploreMoreExperiences")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-turquesa border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
