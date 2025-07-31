"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TravelerDatePicker } from "@/components/booking/TravelerDatePicker";
import { Id } from "@/convex/_generated/dataModel";
import { Minus, Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { stripePromise } from "@/lib/stripe";

interface BookingCardProps {
  experienceId: Id<"experiences">;
  pricePerPerson: number;
  maxGuests: number;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  guestCount: number;
  onGuestCountChange: (count: number) => void;
  totalAmount: number;
  experienceTitle: string;
  hostName: string;
}

export function BookingCard({
  experienceId,
  pricePerPerson,
  maxGuests,
  selectedDate,
  onDateSelect,
  guestCount,
  onGuestCountChange,
  totalAmount,
  experienceTitle,
  hostName,
}: BookingCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isSignedIn } = useUser();
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleGuestIncrement = () => {
    if (guestCount < maxGuests) {
      onGuestCountChange(guestCount + 1);
    }
  };

  const handleGuestDecrement = () => {
    if (guestCount > 1) {
      onGuestCountChange(guestCount - 1);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      toast({
        title: "Fecha requerida",
        description: "Por favor selecciona una fecha para tu reserva.",
        variant: "destructive",
      });
      return;
    }

    if (!isSignedIn) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para hacer una reserva.",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "No se pudo obtener la información del usuario.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create Stripe checkout session
      const result = await createCheckoutSession({
        experienceId,
        travelerId: currentUser._id,
        guestCount,
        selectedDate: selectedDate.toISOString().split("T")[0],
        experienceTitle,
        pricePerPerson,
        hostName,
      });

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe no se pudo cargar");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: result.sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Por favor intenta de nuevo.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reserva tu experiencia</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-turquesa">
              ${pricePerPerson}
            </span>
            <p className="text-sm font-normal text-gris-80">por persona</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Selecciona una fecha
          </Label>
          <TravelerDatePicker
            experienceId={experienceId}
            onDateSelect={onDateSelect}
            selectedDate={selectedDate}
          />
        </div>

        {/* Guest Count Selector */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Número de personas</Label>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gris-80" />
              <span className="text-sm text-gris-80">
                Huéspedes (máx. {maxGuests})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGuestDecrement}
                disabled={guestCount <= 1}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">
                {guestCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGuestIncrement}
                disabled={guestCount >= maxGuests}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gris-80">
              ${pricePerPerson} x {guestCount}{" "}
              {guestCount === 1 ? "persona" : "personas"}
            </span>
            <span className="font-medium">${totalAmount}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-turquesa">
                ${totalAmount} USD
              </span>
            </div>
          </div>
        </div>

        {/* Book Button */}
        <Button
          className="w-full bg-turquesa hover:bg-turquesa/90"
          size="lg"
          onClick={handleBooking}
          disabled={!selectedDate || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Procesando...
            </span>
          ) : (
            "Proceder al pago"
          )}
        </Button>

        {!selectedDate && (
          <p className="text-center text-sm text-gris-80">
            Selecciona una fecha para continuar
          </p>
        )}
      </CardContent>
    </Card>
  );
}
