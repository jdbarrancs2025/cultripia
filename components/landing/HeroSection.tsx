"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

const destinations = [
  "Antigua Guatemala",
  "Lago de Atitlán",
  "Chichicastenango",
  "Quetzaltenango",
  "Semuc Champey",
  "Tikal",
  "Río Dulce",
  "Monterrico",
  "Cobán",
  "Panajachel",
];

export function HeroSection() {
  const router = useRouter();
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (guests) params.set("guests", guests.toString());

    router.push(`/experiences?${params.toString()}`);
  };

  const incrementGuests = () => {
    setGuests((prev) => Math.min(prev + 1, 20));
  };

  const decrementGuests = () => {
    setGuests((prev) => Math.max(prev - 1, 1));
  };

  return (
    <section className="relative w-full">
      <div className="relative h-[600px] w-full overflow-hidden">
        {/* Hero Background Image with Next.js Image Optimization */}
        <Image
          src="/images/hero-background.PNG"
          alt="Guatemala cultural experience"
          fill
          priority
          className="object-cover"
          quality={90}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />

        {/* Additional Color Overlay for brand consistency */}
        <div className="absolute inset-0 bg-turquesa/20" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            {t("title")}
          </h1>
          <p className="mb-10 max-w-2xl text-lg md:text-xl">
            {t("subtitle")}
          </p>
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() =>
              document
                .getElementById("search-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {t("cta")}
          </Button>
        </div>
      </div>

      <div
        id="search-form"
        className="relative z-20 mx-auto -mt-20 max-w-6xl px-4"
      >
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            {t("searchTitle")}
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("whereLabel")}
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("wherePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("whenLabel")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "20/07/2025"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={locale === "es" ? es : enUS}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("whoLabel")}</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={decrementGuests}
                  disabled={guests <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) =>
                    setGuests(
                      Math.max(1, Math.min(20, parseInt(e.target.value) || 1)),
                    )
                  }
                  className="text-center"
                  placeholder={t("numberOfGuests")}
                  min={1}
                  max={20}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={incrementGuests}
                  disabled={guests >= 20}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-end">
              <Button
                className="w-full bg-turquesa hover:bg-turquesa/90"
                onClick={handleSearch}
                disabled={!location}
              >
                {t("search")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
