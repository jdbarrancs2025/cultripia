"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-gray-100 text-gris-80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-8 w-8 text-turquesa" />
              <span className="text-2xl font-bold text-turquesa">
                Cultripia
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Explora */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-gris-90">{t("explore")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/experiences"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("discoverExperiences")}
                </Link>
              </li>
              <li>
                <Link
                  href="/experiences"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("destinations")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("cultureAndLegacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Comunidad */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-gris-90">
              {t("community")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/become-a-host"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("becomeHost")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("supportLocal")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("sustainableImpact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-gris-90">{t("support")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="text-sm hover:text-turquesa transition-colors"
                >
                  {t("travelersGuide")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t border-gray-300 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm">
              {t("copyright")}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm hover:text-turquesa transition-colors"
              >
                {t("privacyPolicy")}
              </Link>
              <Link
                href="/terms"
                className="text-sm hover:text-turquesa transition-colors"
              >
                {t("termsOfUse")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
