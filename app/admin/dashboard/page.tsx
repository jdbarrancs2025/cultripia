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
import { es, enUS } from "date-fns/locale";
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
import { useTranslations, useLocale } from "next-intl";

export default function AdminDashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  const t = useTranslations("adminDashboard");
  const locale = useLocale();
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
  const pendingCancellations = useQuery(api.cancellationRequests.getRequests);
  const pendingCancellationsCount = useQuery(api.cancellationRequests.getPendingCount);

  // Mutations for host application management
  const updateApplicationStatus = useMutation(
    api.hostApplications.updateStatus,
  );
  const updateUserRole = useMutation(api.users.updateUserRole);
  const markCancellationProcessed = useMutation(api.cancellationRequests.markProcessed);

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
        title: t("toast.applicationApproved"),
        description: t("toast.applicationApprovedDesc"),
      });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.approveError"),
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
        title: t("toast.applicationRejected"),
        description: t("toast.applicationRejectedDesc"),
      });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.rejectError"),
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
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("subtitle")}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="applications">{t("tabs.applications")}</TabsTrigger>
          <TabsTrigger value="cancellations">{t("tabs.cancellations")}</TabsTrigger>
          <TabsTrigger value="users">{t("tabs.users")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("metrics.totalUsers")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {t("metrics.hosts", { count: totalHosts })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("metrics.experiences")}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalExperiences}</div>
                <p className="text-xs text-muted-foreground">
                  {t("metrics.active", { count: activeExperiences })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("metrics.totalBookings")}
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {t("metrics.allBookings")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("metrics.totalRevenue")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue} USD</div>
                <p className="text-xs text-muted-foreground">
                  {t("metrics.platformCommission")}
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
                  {t("pendingApplications.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {t("pendingApplications.message", { count: pendingApplicationsCount })}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setActiveTab("applications")}
                >
                  {t("pendingApplications.viewApplications")}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pending Cancellation Requests Alert */}
          {pendingCancellationsCount && pendingCancellationsCount > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-orange-600" />
                  {t("cancellationRequests.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {t("cancellationRequests.message", { count: pendingCancellationsCount })}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setActiveTab("cancellations")}
                >
                  {t("cancellationRequests.viewRequests")}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hostApplications.title")}</CardTitle>
              <CardDescription>
                {t("hostApplications.subtitle")}
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
                            {application.status === "pending" && t("hostApplications.pending")}
                            {application.status === "approved" && t("hostApplications.approved")}
                            {application.status === "rejected" && t("hostApplications.rejected")}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(
                            new Date(application._creationTime),
                            "dd MMM yyyy",
                            { locale: locale === "es" ? es : enUS },
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>{t("hostApplications.experience")}</strong>{" "}
                          {application.applicationData.experienceTitle}
                        </p>
                        <p>
                          <strong>{t("hostApplications.description")}</strong>{" "}
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
                            {t("hostApplications.approve")}
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
                            {t("hostApplications.reject")}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t("hostApplications.noApplications")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancellations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("cancellationRequests.title")}</CardTitle>
              <CardDescription>
                {t("cancellationRequests.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingCancellations && pendingCancellations.length > 0 ? (
                <div className="space-y-4">
                  {pendingCancellations.map((request) => (
                    <div
                      key={request._id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">
                              {request.booking.traveler?.name}
                            </h4>
                            <Badge variant="destructive">
                              {t("cancellationRequests.cancellationRequest")}
                            </Badge>
                          </div>
                          
                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {t("cancellationRequests.experienceDetails")}
                              </p>
                              <p className="text-sm">
                                {locale === "es" ? request.booking.experience?.titleEs : request.booking.experience?.titleEn}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("cancellationRequests.bookingDate")}: {format(
                                  new Date(request.booking.selectedDate),
                                  "dd MMM yyyy",
                                  { locale: locale === "es" ? es : enUS },
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("cancellationRequests.bookingId")}: {request.bookingId}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {t("cancellationRequests.contactInfo")}
                              </p>
                              <p className="text-sm">
                                <strong>{t("cancellationRequests.traveler")}:</strong>
                              </p>
                              <p className="text-sm">{request.booking.traveler?.email}</p>
                              <p className="text-sm mt-2">
                                <strong>{t("cancellationRequests.host")}:</strong>
                              </p>
                              <p className="text-sm">{request.booking.host?.name}</p>
                              <p className="text-sm">{request.booking.host?.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                            <span>
                              {t("cancellationRequests.requestedAt")}: {format(
                                new Date(request.requestedAt),
                                "dd MMM yyyy HH:mm",
                                { locale: locale === "es" ? es : enUS },
                              )}
                            </span>
                            {request.booking.totalAmount && (
                              <span>
                                {t("cancellationRequests.amount")}: ${request.booking.totalAmount} USD
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                await markCancellationProcessed({ requestId: request._id });
                                toast({
                                  title: t("cancellationRequests.processedTitle"),
                                  description: t("cancellationRequests.processedDesc"),
                                });
                              } catch (error) {
                                toast({
                                  title: t("toast.error"),
                                  description: t("cancellationRequests.processError"),
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            {t("cancellationRequests.markProcessed")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t("cancellationRequests.noRequests")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("users.title")}</CardTitle>
              <CardDescription>
                {t("users.subtitle")}
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
                        {user.role === "admin" && t("users.admin")}
                        {user.role === "host" && t("users.host")}
                        {user.role === "traveler" && t("users.traveler")}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t("users.noUsers")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
