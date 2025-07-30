"use client";

import { useParams, redirect, notFound } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, DollarSign, Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { BookingDetailWithTraveler } from "@/types/booking";

export default function BookingDetailPage() {
  const params = useParams();
  const { user } = useUser();

  // Validate bookingId format
  const bookingId = params.bookingId as string;
  if (!bookingId || typeof bookingId !== 'string') {
    notFound();
  }

  if (!user) {
    redirect("/sign-in");
  }

  const booking = useQuery(api.bookings.getBookingById, { 
    bookingId: bookingId as Id<"bookings"> 
  }) as BookingDetailWithTraveler | null | undefined;

  // Handle loading state
  if (booking === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando detalles de la reserva...</span>
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
            <h2 className="text-xl font-semibold mb-2">Reserva no encontrada</h2>
            <p className="text-muted-foreground mb-4">
              No pudimos encontrar esta reserva o no tienes acceso a ella.
            </p>
            <Button asChild>
              <Link href="/dashboard">Volver a mis reservas</Link>
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
          <Link href="/dashboard">← Volver a mis reservas</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalles de la Experiencia</CardTitle>
                {booking.paid ? (
                  <Badge className="bg-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirmada
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pendiente de pago</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.experience?.imageUrl && (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={booking.experience.imageUrl}
                    alt={booking.experience.titleEs || "Experiencia"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority
                  />
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold">
                  {booking.experience?.titleEs}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {booking.experience?.descEs}
                </p>
              </div>

              <div className="grid gap-3 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <span>
                    {format(new Date(booking.selectedDate), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <span>{booking.experience?.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <span>
                    {booking.guestCount} {booking.guestCount === 1 ? "persona" : "personas"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <span className="font-semibold">${booking.totalAmount} USD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Reserva</CardTitle>
              <CardDescription>
                Reserva ID: {booking._id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Fecha de reserva
                  </dt>
                  <dd className="text-sm">
                    {format(new Date(booking.createdAt), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Estado del pago
                  </dt>
                  <dd className="text-sm">
                    {booking.paid ? (
                      <span className="text-green-600 font-medium">Pagado</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Pendiente</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Método de pago
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
              <CardTitle>Información del Anfitrión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{booking.host?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Anfitrión verificado
                </p>
              </div>

              <Separator />

              {isUpcoming && booking.host?.email && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    ¿Necesitas contactar a tu anfitrión?
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <a href={`mailto:${booking.host.email}`} aria-label={`Enviar email a ${booking.host.name}`}>
                      <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                      Enviar Email
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isUpcoming && booking.experience && (
                <Button className="w-full" asChild>
                  <Link href={`/experiences/${booking.experience._id}`}>
                    Reservar de Nuevo
                  </Link>
                </Button>
              )}
              
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard">
                  Volver a Mis Reservas
                </Link>
              </Button>

              {isUpcoming && (
                <p className="text-xs text-muted-foreground text-center">
                  Para cancelaciones, por favor contacta al anfitrión directamente.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}