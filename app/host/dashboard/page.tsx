"use client";

import { useUser } from "@/hooks/useUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, DollarSign, CalendarCheck, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HostDashboardPage() {
  const { user, role } = useUser();
  const t = useTranslations("host");
  const tDashboard = useTranslations("dashboard");
  const locale = useLocale();

  // Fetch host metrics
  const metrics = useQuery(
    api.hosts.getHostMetrics,
    user?._id ? { hostId: user._id } : "skip",
  );

  // Fetch host experiences
  const experiences = useQuery(
    api.experiences.getByHost,
    user?._id ? { hostId: user._id } : "skip",
  );

  // Fetch host bookings
  const bookings = useQuery(
    api.bookings.getHostBookings,
    user?._id ? { hostId: user._id } : "skip",
  );

  if (!user || (role !== "host" && role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          {t("noPermission")}
        </p>
      </div>
    );
  }

  const upcomingBookings =
    bookings?.filter((booking) => new Date(booking.selectedDate) >= new Date())
      .length || 0;

  const totalRevenue =
    bookings?.reduce(
      (sum, booking) => sum + (booking.paid ? booking.totalAmount : 0),
      0,
    ) || 0;

  const monthlyRevenue =
    bookings?.reduce((sum, booking) => {
      const bookingDate = new Date(booking.createdAt);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      if (
        bookingDate.getMonth() === currentMonth &&
        bookingDate.getFullYear() === currentYear &&
        booking.paid
      ) {
        return sum + booking.totalAmount;
      }
      return sum;
    }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t("dashboard")}
        </h1>

        <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("totalBookings")}
                  </CardTitle>
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {upcomingBookings} {t("upcoming")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("totalRevenue")}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("allPaidBookings")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("monthlyRevenue")}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(monthlyRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("activeExperiences")}
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {experiences?.filter((exp: any) => exp.status === "active")
                      .length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("ofTotalExperiences", { total: experiences?.length || 0 })}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{t("recentActivity")}</CardTitle>
                <CardDescription>
                  {t("latestBookingsUpdates")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {locale === 'en' ? booking.experience?.titleEn : booking.experience?.titleEs}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.selectedDate).toLocaleDateString(
                              locale === 'en' ? 'en-US' : 'es-ES',
                            )}{" "}
                            - {booking.qtyPersons} {booking.qtyPersons === 1 ? tDashboard("person") : tDashboard("people")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.paid ? t("paid") : t("pending")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t("noRecentActivity")}</p>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
