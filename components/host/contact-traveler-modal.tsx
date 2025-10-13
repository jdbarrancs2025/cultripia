"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, Users, Mail, Loader2 } from "lucide-react";

interface ContactTravelerModalProps {
  booking: Doc<"bookings"> & {
    experience: Doc<"experiences"> | null;
    traveler: Doc<"users"> | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactTravelerModal({
  booking,
  open,
  onOpenChange,
}: ContactTravelerModalProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sendHostMessage = useMutation(api.hostMessages.sendHostMessage);
  const { toast } = useToast();
  const t = useTranslations("host");
  const locale = useLocale();

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: t("messageError"),
        description: "Please write a message",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      await sendHostMessage({
        bookingId: booking._id,
        message: message.trim(),
      });

      toast({
        title: t("messageSent"),
        description: "Your message has been sent to the traveler",
      });

      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: t("messageError"),
        description:
          error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const experienceTitle =
    locale === "en"
      ? booking.experience?.titleEn || booking.experience?.titleEs || "N/A"
      : booking.experience?.titleEs || booking.experience?.titleEn || "N/A";

  const formattedDate = new Date(booking.selectedDate).toLocaleDateString(
    locale === "en" ? "en-US" : "es-ES",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#009D9B]">
            {t("contactTraveler")}
          </DialogTitle>
          <DialogDescription>
            Send a message to {booking.traveler?.name} about their booking
          </DialogDescription>
        </DialogHeader>

        {/* Booking Details */}
        <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-[#009D9B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Traveler</p>
              <p className="text-sm text-gray-900">{booking.traveler?.name}</p>
              <p className="text-sm text-gray-600">
                {booking.traveler?.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#009D9B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {t("experience")}
              </p>
              <p className="text-sm text-gray-900">{experienceTitle}</p>
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-[#009D9B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {t("persons")}
              </p>
              <p className="text-sm text-gray-900">
                {booking.qtyPersons}{" "}
                {booking.qtyPersons === 1 ? "guest" : "guests"}
              </p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="message" className="text-base font-medium">
              {t("sendMessage")}
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              Write your message to the traveler about this booking
            </p>
          </div>
          <Textarea
            id="message"
            placeholder={t("messagePlaceholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
            disabled={isSending}
          />
          <p className="text-xs text-gray-500">{message.length} characters</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            {t("closeModal")}
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            className="bg-[#009D9B] hover:bg-[#008C8A]"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {t("sendMessage")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
