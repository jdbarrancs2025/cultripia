"use client";

import { useUser } from "@/hooks/useUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations } from "next-intl";
import { BookingsList } from "@/components/host/bookings-list";

export default function HostBookingsPage() {
  const { user, role } = useUser();
  const t = useTranslations("host");

  // Fetch host bookings
  const bookings = useQuery(
    api.bookings.getHostBookings,
    user?._id ? { hostId: user._id } : "skip",
  );

  if (!user || (role !== "host" && role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("noPermission")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("bookings")}</h1>
          <p className="mt-2 text-gray-600">{t("viewManageBookings")}</p>
        </div>

        {bookings === undefined ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">{t("loadingBookings")}</p>
          </div>
        ) : (
          <BookingsList bookings={bookings} />
        )}
      </div>
    </div>
  );
}
