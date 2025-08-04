"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useTranslations, useLocale } from "next-intl";

const testExperiences = [
  {
    titleEn: "Colonial Architecture Walking Tour",
    titleEs: "Tour a Pie de Arquitectura Colonial",
    descEn:
      "Explore the stunning colonial architecture of Antigua Guatemala with a knowledgeable local guide. Visit historic churches, convents, and palaces while learning about the city's rich history.",
    descEs:
      "Explora la impresionante arquitectura colonial de Antigua Guatemala con un guía local experto. Visita iglesias históricas, conventos y palacios mientras aprendes sobre la rica historia de la ciudad.",
    location: "Antigua Guatemala",
    maxGuests: 15,
    priceUsd: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1533581891477-e1e0fae089e1?w=800&q=80",
  },
  {
    titleEn: "Lake Atitlán Kayaking Adventure",
    titleEs: "Aventura en Kayak en el Lago de Atitlán",
    descEn:
      "Paddle across the pristine waters of Lake Atitlán while enjoying breathtaking views of three majestic volcanoes. Perfect for nature lovers and adventure seekers.",
    descEs:
      "Rema a través de las aguas cristalinas del Lago de Atitlán mientras disfrutas de vistas impresionantes de tres majestuosos volcanes. Perfecto para amantes de la naturaleza y buscadores de aventura.",
    location: "Lago de Atitlán",
    maxGuests: 8,
    priceUsd: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1569163139394-de4798d36617?w=800&q=80",
  },
  {
    titleEn: "Traditional Mayan Weaving Workshop",
    titleEs: "Taller de Tejido Maya Tradicional",
    descEn:
      "Learn the ancient art of Mayan weaving from skilled artisans in Chichicastenango. Create your own textile piece using traditional techniques passed down through generations.",
    descEs:
      "Aprende el antiguo arte del tejido maya con artesanos expertos en Chichicastenango. Crea tu propia pieza textil usando técnicas tradicionales transmitidas por generaciones.",
    location: "Chichicastenango",
    maxGuests: 6,
    priceUsd: 55,
    imageUrl:
      "https://images.unsplash.com/photo-1609876112342-f11db89973d7?w=800&q=80",
  },
  {
    titleEn: "Coffee Farm Tour and Tasting",
    titleEs: "Tour de Finca de Café y Degustación",
    descEn:
      "Visit a working coffee plantation near Quetzaltenango. Learn about the coffee production process from bean to cup and enjoy a professional tasting session.",
    descEs:
      "Visita una finca de café en funcionamiento cerca de Quetzaltenango. Aprende sobre el proceso de producción del café desde el grano hasta la taza y disfruta de una sesión de degustación profesional.",
    location: "Quetzaltenango",
    maxGuests: 12,
    priceUsd: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  },
  {
    titleEn: "Semuc Champey Natural Pools Expedition",
    titleEs: "Expedición a las Piscinas Naturales de Semuc Champey",
    descEn:
      "Discover the stunning turquoise pools of Semuc Champey. Swim in crystal-clear waters, explore caves, and enjoy the pristine natural beauty of this hidden paradise.",
    descEs:
      "Descubre las impresionantes piscinas turquesa de Semuc Champey. Nada en aguas cristalinas, explora cuevas y disfruta de la belleza natural prístina de este paraíso escondido.",
    location: "Semuc Champey",
    maxGuests: 10,
    priceUsd: 65,
    imageUrl:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&q=80",
  },
  {
    titleEn: "Tikal Sunrise Archaeological Tour",
    titleEs: "Tour Arqueológico del Amanecer en Tikal",
    descEn:
      "Experience the magic of Tikal at sunrise. Climb ancient pyramids and watch the jungle awaken while learning about Maya civilization from expert archaeologists.",
    descEs:
      "Experimenta la magia de Tikal al amanecer. Sube pirámides antiguas y observa cómo la selva despierta mientras aprendes sobre la civilización maya con arqueólogos expertos.",
    location: "Tikal",
    maxGuests: 20,
    priceUsd: 75,
    imageUrl:
      "https://images.unsplash.com/photo-1518548305430-6acad06d5674?w=800&q=80",
  },
];

export default function TestDataPage() {
  const router = useRouter();
  const t = useTranslations("adminTestData");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const createExperience = useMutation(api.experiences.createExperience);
  const experiences = useQuery(api.experiences.getAll);

  const handleCreateTestData = async () => {
    setLoading(true);
    try {
      for (const exp of testExperiences) {
        await createExperience({
          ...exp,
          status: "active",
        });
      }
      toast({
        title: t("toastSuccess"),
        description: t("toastSuccessDesc", { count: testExperiences.length }),
      });
      router.push("/experiences");
    } catch (error) {
      toast({
        title: t("toastError"),
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const existingCount = experiences?.length || 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("createTestExperiences")}</CardTitle>
          <CardDescription>
            {t("description", { count: testExperiences.length, existing: existingCount })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gris-80">
            {t("followingWillBeCreated")}:
            <ul className="mt-2 list-inside list-disc space-y-1">
              {testExperiences.map((exp, i) => (
                <li key={i}>
                  {locale === "es" ? exp.titleEs : exp.titleEn} - {exp.location} (${exp.priceUsd})
                </li>
              ))}
            </ul>
          </div>
          <Button
            onClick={handleCreateTestData}
            disabled={loading}
            className="bg-turquesa hover:bg-turquesa/90"
          >
            {loading ? t("creating") : t("createButton")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
