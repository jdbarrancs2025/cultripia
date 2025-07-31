"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ExperienceCard } from "@/components/ui/experience-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

const destinations = [
  "Antigua Guatemala",
  "Lago de Atitlán",
  "Chichicastenango",
  "Quetzaltenango",
  "Semuc Champey",
  "Tikal",
  "Río Dulce",
  "Monterrico",
  "Cobán",
  "Panajachel",
];

function ExperiencesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const location = searchParams.get("location") || undefined;
  const date = searchParams.get("date");
  const guests = searchParams.get("guests");

  const data = useQuery(api.experiences.getExperiencesPaginated, {
    location,
    status: "active",
    page: currentPage,
    pageSize: 12,
  });

  const handleLocationChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("location");
    } else {
      params.set("location", value);
    }
    setCurrentPage(1);
    router.push(`/experiences?${params.toString()}`);
  };

  const clearFilters = () => {
    setCurrentPage(1);
    router.push("/experiences");
  };

  const hasActiveFilters = location || date || guests;

  const renderPaginationItems = () => {
    if (!data || data.totalPages <= 1) return null;

    const items = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(data.totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < data.totalPages) {
      if (endPage < data.totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
      items.push(
        <PaginationItem key={data.totalPages}>
          <PaginationLink onClick={() => setCurrentPage(data.totalPages)}>
            {data.totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-6 text-3xl font-bold text-gris-90">
            Experiencias Cultripia
          </h1>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Select
                value={location || "all"}
                onValueChange={handleLocationChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todos los destinos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los destinos</SelectItem>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              )}
            </div>

            {hasActiveFilters && (
              <div className="text-sm text-gris-80">
                Filtros activos:
                {location && (
                  <span className="ml-2 font-medium">Destino: {location}</span>
                )}
                {date && (
                  <span className="ml-2 font-medium">Fecha: {date}</span>
                )}
                {guests && (
                  <span className="ml-2 font-medium">Huéspedes: {guests}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {!data ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="space-y-3 p-6">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : data.experiences.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-lg text-gris-80">
              No se encontraron experiencias disponibles
              {location && ` en ${location}`}.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Limpiar filtros y ver todas
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.experiences.map((experience) => (
                <ExperienceCard
                  key={experience._id}
                  id={experience._id}
                  title={experience.titleEs}
                  description={experience.descEs}
                  location={experience.location}
                  maxGuests={experience.maxGuests}
                  hostName={experience.host?.name || "Anfitrión"}
                  priceUsd={experience.priceUsd}
                  imageUrl={experience.imageUrl}
                />
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(
                            Math.min(data.totalPages, currentPage + 1),
                          )
                        }
                        className={
                          currentPage === data.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExperiencesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquesa mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando experiencias...</p>
          </div>
        </div>
      }
    >
      <ExperiencesContent />
    </Suspense>
  );
}
