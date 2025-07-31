"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, ShoppingCart, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
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
      title: "Total Hosts",
      value: hosts.length,
      icon: Users,
      description: "Active host accounts",
      color: "text-blue-600",
    },
    {
      title: "Total Experiences",
      value: activeExperiences.length,
      icon: Calendar,
      description: "Active experiences",
      color: "text-green-600",
    },
    {
      title: "Total Bookings",
      value: paidBookings.length,
      icon: ShoppingCart,
      description: "Confirmed bookings",
      color: "text-purple-600",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Total revenue",
      color: "text-yellow-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

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
              Pending Host Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              You have {pendingApplications.length} host application
              {pendingApplications.length !== 1 ? "s" : ""} waiting for review.
            </p>
            <a
              href="/admin/applications"
              className="text-yellow-700 underline hover:text-yellow-800 mt-2 inline-block"
            >
              Review applications →
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
