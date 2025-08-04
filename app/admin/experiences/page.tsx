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
import { es, enUS } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";

export default function AdminExperiencesPage() {
  const t = useTranslations("adminExperiences");
  const locale = useLocale();
  const experiences = useQuery(api.experiences.getAll);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-600">
            {t("status.active")}
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">{t("status.inactive")}</Badge>;
      case "draft":
        return <Badge variant="outline">{t("status.draft")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {experiences ? (
        experiences.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.titleEn")}</TableHead>
                <TableHead>{t("table.location")}</TableHead>
                <TableHead>{t("table.maxGuests")}</TableHead>
                <TableHead>{t("table.priceUsd")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.created")}</TableHead>
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
                      locale: locale === "es" ? es : enUS,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">{t("noExperiences")}</p>
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
