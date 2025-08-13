"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === locale || isChanging) return;
    
    setIsChanging(true);
    
    try {
      // Update locale via API
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: newLocale }),
      });
      
      if (response.ok) {
        // Reload the page to ensure server-side locale detection picks up the new cookie
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to change locale:", error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange} disabled={isChanging}>
      <SelectTrigger className="w-[140px] bg-transparent border-gray-300">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
      </SelectContent>
    </Select>
  );
}