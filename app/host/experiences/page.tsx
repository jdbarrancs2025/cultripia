"use client"

import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Calendar } from "lucide-react"
import Link from "next/link"

export default function HostExperiencesPage() {
  const router = useRouter()
  const { user } = useUser()
  
  // Get the user from Convex
  const convexUser = useQuery(api.users.getUserByClerkId, 
    user?.id ? { clerkId: user.id } : "skip"
  )
  
  // Get experiences - all experiences for admin, host's experiences for hosts
  const experiences = useQuery(api.experiences.getExperiences, 
    convexUser?._id ? (convexUser.role === "admin" ? {} : { hostId: convexUser._id }) : "skip"
  )

  if (!user || !convexUser) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (convexUser.role !== "host" && convexUser.role !== "admin") {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              You need to be approved as a host to access this page.
            </p>
            <div className="text-center mt-4">
              <Button onClick={() => router.push("/become-a-host")}>
                Apply to Become a Host
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Experiences</h1>
          <p className="text-gray-600 mt-2">
            Manage your cultural experiences and availability.
          </p>
        </div>
        
        <Button onClick={() => router.push("/host/experiences/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Experience
        </Button>
      </div>

      {experiences && experiences.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Experiences</CardTitle>
            <CardDescription>
              Click on an experience to edit details or manage availability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Max Guests</TableHead>
                  <TableHead>Price (USD)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.map((experience) => (
                  <TableRow key={experience._id}>
                    <TableCell className="font-medium">
                      {experience.titleEn}
                    </TableCell>
                    <TableCell>{experience.location}</TableCell>
                    <TableCell>{experience.maxGuests}</TableCell>
                    <TableCell>${experience.priceUsd}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          experience.status === "active" 
                            ? "default" 
                            : experience.status === "draft"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {experience.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/host/experiences/${experience._id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/host/experiences/${experience._id}/availability`)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No experiences yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first experience to start sharing your culture with travelers.
              </p>
              <Button onClick={() => router.push("/host/experiences/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}