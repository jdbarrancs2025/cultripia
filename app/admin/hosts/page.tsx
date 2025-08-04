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

export default function AdminHostsPage() {
  const t = useTranslations("adminHosts");
  const locale = useLocale();
  const users = useQuery(api.users.getAll);
  const hosts = users?.filter((user) => user.role === "host") || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {users ? (
        hosts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.role")}</TableHead>
                <TableHead>{t("table.joined")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hosts.map((host) => (
                <TableRow key={host._id}>
                  <TableCell className="font-medium">{host.name}</TableCell>
                  <TableCell>{host.email}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-600">
                      {t("host")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(host.createdAt), {
                      addSuffix: true,
                      locale: locale === "es" ? es : enUS,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t("active")}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">{t("noHosts")}</p>
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
