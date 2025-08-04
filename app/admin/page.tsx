"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, ShoppingCart, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function AdminDashboard() {
  const t = useTranslations("adminOverview");
  const users = useQuery(api.users.getAll);
  const experiences = useQuery(api.experiences.getAll);
  const bookings = useQuery(api.bookings.getAll);
  const pendingApplications = useQuery(
    api.hostApplications.getApplicationsByStatus,
    {
      status: "pending",
    },
  );

  const hosts = users?.filter((user) => user.role === "host") || [];
  const activeExperiences =
    experiences?.filter((exp) => exp.status === "active") || [];
  const paidBookings = bookings?.filter((booking) => booking.paid) || [];
  const totalRevenue = paidBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0,
  );

  const metrics = [
    {
      title: t("totalHosts"),
      value: hosts.length,
      icon: Users,
      description: t("activeHostAccounts"),
      color: "text-blue-600",
    },
    {
      title: t("totalExperiences"),
      value: activeExperiences.length,
      icon: Calendar,
      description: t("activeExperiences"),
      color: "text-green-600",
    },
    {
      title: t("totalBookings"),
      value: paidBookings.length,
      icon: ShoppingCart,
      description: t("confirmedBookings"),
      color: "text-purple-600",
    },
    {
      title: t("revenue"),
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: t("totalRevenue"),
      color: "text-yellow-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              {users && experiences && bookings ? (
                <>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </>
              ) : (
                <div>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Applications Alert */}
      {pendingApplications && pendingApplications.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-800">
              {t("pendingHostApplications")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              {t("pendingApplicationsMessage", {
                count: pendingApplications.length,
                plural: pendingApplications.length !== 1 ? "s" : ""
              })}
            </p>
            <a
              href="/admin/applications"
              className="text-yellow-700 underline hover:text-yellow-800 mt-2 inline-block"
            >
              {t("reviewApplications")}
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
