"use client";

import { Doc } from "@/convex/_generated/dataModel";
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
import { Edit, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ExperiencesListProps {
  experiences: Doc<"experiences">[];
}

export function ExperiencesList({ experiences }: ExperiencesListProps) {
  if (experiences.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-4">
          No tienes experiencias creadas aún.
        </p>
        <Link href="/host/experiences/new">
          <Button className="bg-[#009D9B] hover:bg-[#008C8A]">
            Crear Primera Experiencia
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Mis Experiencias</h2>
          <Link href="/host/experiences/new">
            <Button className="bg-[#009D9B] hover:bg-[#008C8A]">
              Nueva Experiencia
            </Button>
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.map((experience) => (
            <TableRow key={experience._id}>
              <TableCell className="font-medium">
                {experience.titleEs || experience.titleEn}
              </TableCell>
              <TableCell>{experience.location}</TableCell>
              <TableCell>{formatCurrency(experience.priceUsd)}</TableCell>
              <TableCell>{experience.maxGuests} personas</TableCell>
              <TableCell>
                <Badge
                  variant={
                    experience.status === "active" ? "default" : "secondary"
                  }
                  className={
                    experience.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : ""
                  }
                >
                  {experience.status === "active" ? "Activa" : "Inactiva"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Link href={`/experiences/${experience._id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href={`/host/experiences/${experience._id}/availability`}
                  >
                    <Button variant="ghost" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/host/experiences/${experience._id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
