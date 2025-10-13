"use client";

import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Users, Mail } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface BookingsListProps {
  bookings: Array<
    Doc<"bookings"> & {
      experience: Doc<"experiences"> | null;
      traveler: Doc<"users"> | null;
    }
  >;
}

export function BookingsList({ bookings }: BookingsListProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const t = useTranslations("host");
  const locale = useLocale();

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "upcoming") {
      return bookingDate >= today;
    } else if (filter === "past") {
      return bookingDate < today;
    }
    return true;
  });

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">{t("noBookingsYet")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t("bookingsTitle")}</CardTitle>
            <CardDescription>{t("manageBookings")}</CardDescription>
          </div>
          <Select
            value={filter}
            onValueChange={(value: any) => setFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filterBookings")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allBookings")}</SelectItem>
              <SelectItem value="upcoming">{t("upcomingBookings")}</SelectItem>
              <SelectItem value="past">{t("pastBookings")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("experience")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("traveler")}</TableHead>
              <TableHead>{t("persons")}</TableHead>
              <TableHead>{t("total")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("contact")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell className="font-medium">
                  {locale === "en"
                    ? booking.experience?.titleEn ||
                      booking.experience?.titleEs ||
                      "N/A"
                    : booking.experience?.titleEs ||
                      booking.experience?.titleEn ||
                      "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(booking.selectedDate).toLocaleDateString(
                      locale === "en" ? "en-US" : "es-ES",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </div>
                </TableCell>
                <TableCell>{booking.traveler?.name || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    {booking.qtyPersons}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={booking.paid ? "default" : "secondary"}
                    className={
                      booking.paid
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }
                  >
                    {booking.paid ? t("paid") : t("pending")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {booking.traveler?.email ? (
                    <a
                      href={`mailto:${booking.traveler.email}`}
                      className="flex items-center gap-2 text-[#009D9B] hover:text-[#008C8A] hover:underline transition-colors"
                      title={`Email ${booking.traveler.name}`}
                    >
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{booking.traveler.email}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
