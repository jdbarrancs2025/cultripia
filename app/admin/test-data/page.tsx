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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useTranslations, useLocale } from "next-intl";
import { Mail } from "lucide-react";

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
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const createExperience = useMutation(api.experiences.createExperience);
  const experiences = useQuery(api.experiences.getAll);
  const users = useQuery(api.users.getAll);

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

  const handleSendTestEmail = async () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user to send the test email to",
        variant: "destructive",
      });
      return;
    }

    const user = users?.find((u) => u._id === selectedUser);
    if (!user) {
      toast({
        title: "Error",
        description: "Selected user not found",
        variant: "destructive",
      });
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch("/api/emails/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: user.email,
          recipientName: user.name,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: `Test email sent successfully to ${user.email}`,
        });
        setSelectedUser("");
      } else {
        throw new Error(data.error || "Failed to send test email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const existingCount = experiences?.length || 0;
  const travelerUsers = users?.filter((u) => u.role === "traveler") || [];

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Test Email System
          </CardTitle>
          <CardDescription>
            Send a test email to verify that the Resend email service is working correctly.
            Select a traveler user from the dropdown to send them a test email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Traveler User
            </label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a traveler to send test email to..." />
              </SelectTrigger>
              <SelectContent>
                {travelerUsers.length === 0 ? (
                  <SelectItem value="no-users" disabled>
                    No traveler users found
                  </SelectItem>
                ) : (
                  travelerUsers.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          {selectedUser && (
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
              <p className="font-medium">Test email will be sent to:</p>
              <p className="mt-1">
                {travelerUsers.find((u) => u._id === selectedUser)?.name} -{" "}
                {travelerUsers.find((u) => u._id === selectedUser)?.email}
              </p>
            </div>
          )}

          <Button
            onClick={handleSendTestEmail}
            disabled={sendingEmail || !selectedUser || travelerUsers.length === 0}
            className="bg-turquesa hover:bg-turquesa/90"
          >
            {sendingEmail ? "Sending Test Email..." : "Send Test Email"}
          </Button>

          {travelerUsers.length === 0 && (
            <p className="text-sm text-amber-600">
              No traveler users found in the system. Please create a traveler account first to test the email functionality.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
