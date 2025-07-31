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
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminApplicationsPage() {
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
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Host Applications</h1>

      {applications ? (
        applications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Experience Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
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
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApplication(application)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">No applications found.</p>
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
            <DialogTitle>Review Host Application</DialogTitle>
            <DialogDescription>
              Review the application details and decide whether to approve or
              reject.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Name</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Phone</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Location</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.location}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Languages</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.languages.join(", ")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">
                    Experience Type
                  </Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.experienceType}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">
                  Experience Title
                </Label>
                <p className="text-sm">
                  {selectedApplication.applicationData.experienceTitle}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold">
                  Experience Description
                </Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {selectedApplication.applicationData.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Pricing</Label>
                  <p className="text-sm">
                    ${selectedApplication.applicationData.pricing} USD per
                    person
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Availability</Label>
                  <p className="text-sm">
                    {selectedApplication.applicationData.availability}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="feedback">Feedback (optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Add any feedback for the applicant..."
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
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={
                    isProcessing || selectedApplication.status !== "pending"
                  }
                >
                  Reject
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={
                    isProcessing || selectedApplication.status !== "pending"
                  }
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
