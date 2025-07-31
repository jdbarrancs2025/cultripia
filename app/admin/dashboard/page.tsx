"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { redirect } from "next/navigation";
import {
  Users,
  Package,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Get current user from Convex
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );

  // Redirect if not admin
  if (currentUser && currentUser.role !== "admin") {
    redirect("/dashboard");
  }

  // Get admin metrics
  const pendingApplicationsCount = useQuery(
    api.hostApplications.getPendingApplicationsCount,
  );
  const allApplications = useQuery(api.hostApplications.getAll);
  const allUsers = useQuery(api.users.getAll);
  const allExperiences = useQuery(api.experiences.getAll);
  const allBookings = useQuery(api.bookings.getAll);

  // Mutations for host application management
  const updateApplicationStatus = useMutation(
    api.hostApplications.updateStatus,
  );
  const updateUserRole = useMutation(api.users.updateUserRole);

  const handleApproveApplication = async (
    applicationId: Id<"hostApplications">,
  ) => {
    try {
      const application = allApplications?.find(
        (app) => app._id === applicationId,
      );
      if (!application) return;

      await updateApplicationStatus({
        applicationId,
        status: "approved",
      });

      await updateUserRole({
        userId: application.userId,
        role: "host",
      });

      toast({
        title: "Aplicación aprobada",
        description: "El usuario ahora es un anfitrión.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar la aplicación.",
        variant: "destructive",
      });
    }
  };

  const handleRejectApplication = async (
    applicationId: Id<"hostApplications">,
  ) => {
    try {
      await updateApplicationStatus({
        applicationId,
        status: "rejected",
      });

      toast({
        title: "Aplicación rechazada",
        description: "La aplicación ha sido rechazada.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la aplicación.",
        variant: "destructive",
      });
    }
  };

  // Calculate metrics
  const totalUsers = allUsers?.length || 0;
  const totalHosts =
    allUsers?.filter((u) => u.role === "host" || u.role === "admin").length ||
    0;
  const totalExperiences = allExperiences?.length || 0;
  const activeExperiences =
    allExperiences?.filter((e) => e.status === "active").length || 0;
  const totalBookings = allBookings?.length || 0;
  const totalRevenue =
    allBookings?.reduce(
      (sum, booking) => sum + (booking.paid ? booking.totalAmount : 0),
      0,
    ) || 0;

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona la plataforma Cultripia
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="applications">Aplicaciones</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuarios Totales
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {totalHosts} anfitriones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Experiencias
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalExperiences}</div>
                <p className="text-xs text-muted-foreground">
                  {activeExperiences} activas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Reservas Totales
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Todas las reservas
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
                <div className="text-2xl font-bold">${totalRevenue} USD</div>
                <p className="text-xs text-muted-foreground">
                  Comisión de plataforma
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Applications Alert */}
          {pendingApplicationsCount && pendingApplicationsCount > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Aplicaciones Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Tienes {pendingApplicationsCount} aplicaciones de anfitrión
                  pendientes de revisión.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setActiveTab("applications")}
                >
                  Ver Aplicaciones
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aplicaciones de Anfitrión</CardTitle>
              <CardDescription>
                Revisa y aprueba las aplicaciones para convertirse en anfitrión
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allApplications && allApplications.length > 0 ? (
                <div className="space-y-4">
                  {allApplications.map((application) => (
                    <div
                      key={application._id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">
                            {application.applicationData.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {application.applicationData.email} •{" "}
                            {application.applicationData.phone}
                          </p>
                          <Badge
                            variant={
                              application.status === "pending"
                                ? "secondary"
                                : application.status === "approved"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {application.status === "pending" && "Pendiente"}
                            {application.status === "approved" && "Aprobado"}
                            {application.status === "rejected" && "Rechazado"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(
                            new Date(application._creationTime),
                            "dd MMM yyyy",
                            { locale: es },
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Experiencia:</strong>{" "}
                          {application.applicationData.experienceTitle}
                        </p>
                        <p>
                          <strong>Descripción:</strong>{" "}
                          {application.applicationData.description}
                        </p>
                      </div>

                      {application.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApproveApplication(application._id)
                            }
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleRejectApplication(application._id)
                            }
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay aplicaciones en este momento
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Registrados</CardTitle>
              <CardDescription>
                Lista de todos los usuarios en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allUsers && allUsers.length > 0 ? (
                <div className="space-y-2">
                  {allUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "default"
                            : user.role === "host"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {user.role === "admin" && "Administrador"}
                        {user.role === "host" && "Anfitrión"}
                        {user.role === "traveler" && "Viajero"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay usuarios registrados
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
