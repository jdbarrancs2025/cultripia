"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function BookingCancelPage() {
  const router = useRouter();
  const t = useTranslations("bookingCancel");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">{t("paymentCancelled")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            {t("bookingNotCompleted")}
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                {t("problemDuringPayment")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.back()}
                className="w-full bg-turquesa hover:bg-turquesa/90"
              >
                {t("tryAgain")}
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/experiences">{t("exploreExperiences")}</Link>
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            {t("needHelp")}
            <a
              href="mailto:support@cultripia.com"
              className="text-turquesa hover:underline"
            >
              {t("supportEmail")}
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
