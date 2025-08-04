"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";

export default function AdminApplicationsPage() {
  const t = useTranslations("adminApplications");
  const locale = useLocale();
  const applications = useQuery(api.hostApplications.getAll);
  const updateApplicationStatus = useMutation(
    api.hostApplications.updateStatus,
  );
  const updateUserRole = useMutation(api.users.updateUserRole);

  const [selectedApplication, setSelectedApplication] =
    useState<Doc<"hostApplications"> | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    if (!selectedApplication) return;

    setIsProcessing(true);
    try {
      // Update application status
      await updateApplicationStatus({
        applicationId: selectedApplication._id,
        status,
        feedback: feedback || undefined,
      });

      // If approved, update user role to host
      if (status === "approved") {
        await updateUserRole({
          userId: selectedApplication.userId,
          role: "host",
        });
      }

      // Send email notification via API route
      try {
        const emailResponse = await fetch("/api/emails/application-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicantName: selectedApplication.applicationData.name,
            applicantEmail: selectedApplication.applicationData.email,
            status,
            feedback: feedback || undefined,
          }),
        });

        if (!emailResponse.ok) {
          console.error("Failed to send status email");
        }
      } catch (error) {
        console.error("Error sending status email:", error);
      }

      // Close modal and reset state
      setSelectedApplication(null);
      setFeedback("");
    } catch (error) {
      console.error("Error updating application:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">{t("status.pending")}</Badge>;
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            {t("status.approved")}
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">{t("status.rejected")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {applications ? (
        applications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.phone")}</TableHead>
                <TableHead>{t("table.experienceType")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.submitted")}</TableHead>
                <TableHead>{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell className="font-medium">
                    {application.applicationData.name}
                  </TableCell>
                  <TableCell>{application.applicationData.email}</TableCell>
                  <TableCell>{application.applicationData.phone}</TableCell>
                  <TableCell>
                    {application.applicationData.experienceType}
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(application.createdAt), {
                      addSuffix: true,
                      locale: locale === "es" ? es : enUS,
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApplication(application)}
                    >
                      {t("table.review")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">{t("noApplications")}</p>
        )
      ) : (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Dialog
        open={!!selectedApplication}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setSelectedApplication(null);
            setFeedback("");
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("modal.title")}</DialogTitle>
            <DialogDescription>
              {t("modal.description")}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">{t("modal.name")}</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">{t("modal.email")}</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">{t("modal.phone")}</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">{t("modal.location")}</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.location}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">{t("modal.languages")}</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.languages.join(", ")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">
                    {t("modal.experienceType")}
                  </Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.experienceType}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">
                  {t("modal.experienceTitle")}
                </Label>
                <p className="text-sm">
                  {selectedApplication.applicationData.experienceTitle}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold">
                  {t("modal.experienceDescription")}
                </Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {selectedApplication.applicationData.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">{t("modal.pricing")}</Label>
                  <p className="text-sm">
                    ${selectedApplication.applicationData.pricing} {t("modal.perPerson")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">{t("modal.availability")}</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.availability}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="feedback">{t("modal.feedback")}</Label>
                <Textarea
                  id="feedback"
                  placeholder={t("modal.feedbackPlaceholder")}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApplication(null)}
                  disabled={isProcessing}
                >
                  {t("modal.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={
                    isProcessing || selectedApplication.status !== "pending"
                  }
                >
                  {t("modal.reject")}
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={
                    isProcessing || selectedApplication.status !== "pending"
                  }
                >
                  {t("modal.approve")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
