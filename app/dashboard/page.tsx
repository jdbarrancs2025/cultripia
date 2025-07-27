"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const currentUser = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : "skip");
  const pendingApplicationsCount = useQuery(
    api.hostApplications.getPendingApplicationsCount,
    currentUser?.role === "admin" ? {} : "skip"
  );

  // Show success message if coming from application submission
  useEffect(() => {
    if (searchParams.get("application") === "submitted") {
      toast({
        title: "Application received!",
        description: "Your host application is under review. We'll notify you within 48 hours.",
      });
    }
  }, [searchParams, toast]);

  // Show loading skeleton
  if (!isLoaded || !user || !currentUser) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.firstName || "Traveler"}!</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Role-based dashboard content */}
        {currentUser.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pendingApplicationsCount || 0}</p>
              <p className="text-sm text-gray-600">Pending Host Applications</p>
            </CardContent>
          </Card>
        )}
        
        {currentUser.role === "host" && (
          <Card>
            <CardHeader>
              <CardTitle>Host Dashboard</CardTitle>
              <CardDescription>Manage your experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Your host dashboard will be available soon!</p>
            </CardContent>
          </Card>
        )}
        
        {currentUser.role === "traveler" && (
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>View and manage your bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">You haven&apos;t made any bookings yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}