"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import countries from "i18n-iso-countries";
import enCountries from "i18n-iso-countries/langs/en.json";
import esCountries from "i18n-iso-countries/langs/es.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Register languages
countries.registerLocale(enCountries);
countries.registerLocale(esCountries);

interface CountrySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CountrySelect({
  value,
  onValueChange,
  placeholder,
  required = false,
  disabled = false,
}: CountrySelectProps) {
  const locale = useLocale();
  const [countryList, setCountryList] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    // Get country names in the current locale
    const countryNames = countries.getNames(locale === "es" ? "es" : "en");
    
    // Convert to array and sort by name
    const sortedCountries = Object.entries(countryNames)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
    
    setCountryList(sortedCountries);
  }, [locale]);

  // If value is a country code, use it; otherwise try to find by name
  const selectedValue = value && countryList.length > 0
    ? countryList.find(c => c.name === value || c.code === value)?.name || value
    : value;

  return (
    <Select
      value={selectedValue}
      onValueChange={onValueChange}
      required={required}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder || "Select a country"} />
      </SelectTrigger>
      <SelectContent>
        {countryList.map((country) => (
          <SelectItem key={country.code} value={country.name}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}