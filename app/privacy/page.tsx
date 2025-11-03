import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("legal");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          {t("privacyTitle")}
        </h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-4">
            {t("privacyDescription")}
          </p>
          <p className="text-muted-foreground">
            {t("comingSoon")}
          </p>
        </div>
      </div>
    </div>
  );
}
