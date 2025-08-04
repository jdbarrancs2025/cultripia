"use client";

import { useTranslations } from "next-intl";

export default function AdminSettingsPage() {
  const t = useTranslations("adminSettings");
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <p className="text-gray-600">{t("comingSoon")}</p>
    </div>
  );
}
