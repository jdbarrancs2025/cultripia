"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminExperiencesPage() {
  const experiences = useQuery(api.experiences.getAll);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-600">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Experience Management</h1>

      {experiences ? (
        experiences.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title (EN)</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Max Guests</TableHead>
                <TableHead>Price (USD)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
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
                  <TableCell>{getStatusBadge(experience.status)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(experience.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">No experiences found.</p>
        )
      ) : (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}
    </div>
  );
}
