"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { HostCalendar } from "@/components/host/HostCalendar";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { useTranslations, useLocale } from "next-intl";

export default function ExperienceAvailabilityPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const t = useTranslations("availability");
  const locale = useLocale();
  const experienceId = params.id as Id<"experiences">;

  // Get current user
  const currentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  // Get experience details
  const experience = useQuery(api.experiences.getExperience, {
    id: experienceId,
  });

  // Check if user is the host or admin
  const isAuthorized =
    currentUser &&
    experience &&
    (currentUser._id === experience.hostId || currentUser.role === "admin");

  if (!user || !currentUser) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-900">
            {t("accessDenied")}
          </h2>
          <p className="mt-2 text-red-700">
            {t("noPermission")}
          </p>
          <Button
            onClick={() => router.push("/host/dashboard")}
            className="mt-4"
          >
            {t("backToDashboard")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/host/dashboard")}
            className="mb-2"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {t("backToDashboard")}
          </Button>
          <h1 className="text-2xl font-bold text-gris-90">
            {t("manageAvailability")}
          </h1>
          <p className="text-gris-80">{locale === "es" ? experience.titleEs : experience.titleEn}</p>
        </div>
      </div>

      <HostCalendar experienceId={experienceId} />

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-900">{t("tips")}</h3>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>• {t("tip1")}</li>
          <li>• {t("tip2")}</li>
          <li>• {t("tip3")}</li>
          <li>• {t("tip4")}</li>
          <li>• {t("tip5")}</li>
        </ul>
      </div>
    </div>
  );
}
