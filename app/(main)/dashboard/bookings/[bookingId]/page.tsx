"use client";

import { useParams, redirect, notFound } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Mail,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { BookingDetailWithTraveler } from "@/types/booking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function BookingDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const t = useTranslations("bookingDetails");
  const locale = useLocale();
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isRequestingCancellation, setIsRequestingCancellation] = useState(false);

  // Validate bookingId format
  const bookingId = params.bookingId as string;
  if (!bookingId || typeof bookingId !== "string") {
    notFound();
  }

  if (!user) {
    redirect("/sign-in");
  }

  const booking = useQuery(api.bookings.getBookingById, {
    bookingId: bookingId as Id<"bookings">,
  }) as BookingDetailWithTraveler | null | undefined;

  const createCancellationRequest = useMutation(api.cancellationRequests.createRequest);
  const existingCancellationRequest = useQuery(api.cancellationRequests.getRequestForBooking, {
    bookingId: bookingId as Id<"bookings">,
  });

  // Handle loading state
  if (booking === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t("loadingBookingDetails")}</span>
        </div>
      </div>
    );
  }

  // Handle not found or error state
  if (booking === null) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {t("bookingNotFound")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("bookingNotFoundDescription")}
            </p>
            <Button asChild>
              <Link href="/dashboard">{t("backToBookings")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(booking.selectedDate);
  bookingDate.setHours(0, 0, 0, 0);
  const isUpcoming = bookingDate >= today;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">← {t("backToBookings")}</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("experienceDetails")}</CardTitle>
                {booking.paid ? (
                  <Badge className="bg-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t("confirmed")}
                  </Badge>
                ) : (
                  <Badge variant="secondary">{t("pendingPayment")}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.experience?.imageUrl && (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={booking.experience.imageUrl}
                    alt={(locale === "es" ? booking.experience.titleEs : booking.experience.titleEn) || "Experience"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority
                  />
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold">
                  {locale === "es" ? booking.experience?.titleEs : booking.experience?.titleEn}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {locale === "es" ? booking.experience?.descEs : booking.experience?.descEn}
                </p>
              </div>

              <div className="grid gap-3 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>
                    {format(
                      new Date(booking.selectedDate),
                      locale === "es" ? "EEEE, d 'de' MMMM 'de' yyyy" : "EEEE, MMMM d, yyyy",
                      { locale: locale === "es" ? es : enUS },
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>{booking.experience?.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>
                    {booking.guestCount}{" "}
                    {booking.guestCount === 1 ? t("person") : t("people")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="font-semibold">
                    ${booking.totalAmount} USD
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("bookingInformation")}</CardTitle>
              <CardDescription>{t("bookingId")}: {booking._id}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("bookingDate")}
                  </dt>
                  <dd className="text-sm">
                    {format(
                      new Date(booking.createdAt),
                      locale === "es" ? "d 'de' MMMM 'de' yyyy, HH:mm" : "MMMM d, yyyy, h:mm a",
                      { locale: locale === "es" ? es : enUS },
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("paymentStatus")}
                  </dt>
                  <dd className="text-sm">
                    {booking.paid ? (
                      <span className="text-green-600 font-medium">{t("paid")}</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        {t("pending")}
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("paymentMethod")}
                  </dt>
                  <dd className="text-sm">Stripe</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Host Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("hostInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{booking.host?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("verifiedHost")}
                </p>
              </div>

              <Separator />

              {isUpcoming && booking.host?.email && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("needToContactHost")}
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <a
                      href={`mailto:${booking.host.email}`}
                      aria-label={`Enviar email a ${booking.host.name}`}
                    >
                      <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t("sendEmail")}
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isUpcoming && booking.experience && (
                <Button className="w-full" asChild>
                  <Link href={`/experiences/${booking.experience._id}`}>
                    {t("bookAgain")}
                  </Link>
                </Button>
              )}

              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard">{t("backToMyBookings")}</Link>
              </Button>

              {isUpcoming && (
                <>
                  {existingCancellationRequest ? (
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        disabled
                      >
                        {t("cancellationPending")}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        {t("cancellationPendingNote")}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Button 
                        className="w-full" 
                        variant="destructive" 
                        onClick={() => setShowCancelDialog(true)}
                      >
                        {t("cancelBooking")}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        {t("cancellationNote")}
                      </p>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cancelBookingTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("cancelBookingConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRequestingCancellation}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRequestingCancellation}
              onClick={async () => {
                setIsRequestingCancellation(true);
                try {
                  await createCancellationRequest({ 
                    bookingId: bookingId as Id<"bookings"> 
                  });
                  toast({
                    title: t("cancellationRequested"),
                    description: t("cancellationRequestedDesc"),
                  });
                  setShowCancelDialog(false);
                } catch (error) {
                  toast({
                    title: t("cancellationError"),
                    description: error instanceof Error ? error.message : t("cancellationErrorDesc"),
                    variant: "destructive",
                  });
                } finally {
                  setIsRequestingCancellation(false);
                }
              }}
            >
              {isRequestingCancellation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("continueCancellation")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
