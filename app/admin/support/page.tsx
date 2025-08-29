"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Mail, User, Calendar, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSupportPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved">("all");
  interface SupportRequest {
    _id: Id<"supportRequests">;
    name: string;
    email: string;
    message: string;
    status: "pending" | "resolved";
    createdAt: number;
    resolvedAt?: number;
  }
  
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const supportRequests = useQuery(
    api.support.listSupportRequests,
    statusFilter === "all" ? {} : { status: statusFilter }
  );
  const stats = useQuery(api.support.getSupportRequestStats);
  const updateStatus = useMutation(api.support.updateSupportStatus);

  const handleUpdateStatus = async (
    requestId: Id<"supportRequests">,
    newStatus: "pending" | "resolved"
  ) => {
    try {
      await updateStatus({
        requestId,
        status: newStatus,
      });
      setIsDetailsOpen(false);
    } catch (error) {
      console.error("Failed to update support request status:", error);
      // You might want to show a toast notification here
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMM dd, yyyy 'at' h:mm a");
  };

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 border-green-300">
        <CheckCircle className="mr-1 h-3 w-3" />
        Resolved
      </Badge>
    );
  };

  if (!supportRequests || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support Requests</h1>
        <p className="text-gray-600 mt-2">
          Manage and respond to support requests from users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Requests</CardTitle>
              <CardDescription>
                Click on a request to view details and update status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {supportRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No support requests found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell className="font-medium">
                          {request.name}
                        </TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request.message}
                        </TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsDetailsOpen(true);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription>
              Review the request and update its status
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Name:</span>
                    {selectedRequest.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">Email:</span>
                    <a
                      href={`mailto:${selectedRequest.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedRequest.email}
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Submitted:</span>
                    {formatDate(selectedRequest.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600">Status:</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message:</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>

              {selectedRequest.resolvedAt && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Resolved at:</span>{" "}
                  {formatDate(selectedRequest.resolvedAt)}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedRequest.status === "pending" ? (
                  <Button
                    onClick={() =>
                      handleUpdateStatus(selectedRequest._id, "resolved")
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark as Resolved
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      handleUpdateStatus(selectedRequest._id, "pending")
                    }
                    variant="outline"
                  >
                    Reopen Request
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}