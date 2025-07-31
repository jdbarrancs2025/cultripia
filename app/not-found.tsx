"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <div>
          <h1 className="text-9xl font-bold text-turquesa">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 mt-2">
            {t("description")}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="bg-turquesa hover:bg-turquesa/90">
            <Link href="/">
              {t("goHome")}
            </Link>
          </Button>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link 
              href="/experiences" 
              className="text-turquesa hover:underline"
            >
              {t("browseExperiences")}
            </Link>
            <span className="text-gray-400">|</span>
            <Link 
              href="/become-a-host" 
              className="text-turquesa hover:underline"
            >
              {t("becomeHost")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}