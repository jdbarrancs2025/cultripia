"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, DollarSign, CalendarCheck, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ExperiencesList } from "@/components/host/experiences-list";
import { BookingsList } from "@/components/host/bookings-list";
import { CalendarView } from "@/components/host/calendar-view";

export default function HostDashboardPage() {
  const { user, role } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

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
          No tienes permisos para ver esta página.
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
          Panel de Control
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="experiences">Experiencias</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Reservas
                  </CardTitle>
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {upcomingBookings} próximas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos Totales
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Todas las reservas pagadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos Este Mes
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(monthlyRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Experiencias Activas
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {experiences?.filter((exp: any) => exp.status === "active")
                      .length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    De {experiences?.length || 0} experiencias totales
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas reservas y actualizaciones
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
                            {booking.experience?.titleEs}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.selectedDate).toLocaleDateString(
                              "es-ES",
                            )}{" "}
                            - {booking.qtyPersons} personas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.paid ? "Pagado" : "Pendiente"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay actividad reciente</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiences">
            <ExperiencesList experiences={experiences || []} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsList bookings={bookings || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
