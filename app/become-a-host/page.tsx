"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

// These will be populated inside the component
const languageKeys = [
  "spanish",
  "english",
  "french",
  "german",
  "italian",
  "portuguese",
  "kiche",
  "kaqchikel",
];

const experienceTypeKeys = [
  "cooking",
  "artisanal",
  "cultural",
  "nature",
  "historical",
  "spiritual",
  "agricultural",
  "textile",
];

export default function BecomeAHostPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("becomeHost");
  const createApplication = useMutation(api.hostApplications.createApplication);

  // Create translated arrays
  const languages = languageKeys.map(key => ({
    value: key,
    label: t(`languages.${key}`)
  }));

  const experienceTypes = experienceTypeKeys.map(key => ({
    value: key,
    label: t(`experienceTypes.${key}`)
  }));

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    location: "",
    languagesSpoken: [] as string[],

    // Experience Proposal
    experienceType: "",
    experienceTitle: "",
    experienceDescription: "",
    maxGuests: "",
    pricePerPerson: "",
    availability: "",
    specialRequirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.includes(language)
        ? prev.languagesSpoken.filter((l) => l !== language)
        : [...prev.languagesSpoken, language],
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Allow international format with optional + and country code
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s()-]/g, ""));
  };

  const sanitizeInput = (input: string) => {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a host application",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.location ||
      formData.languagesSpoken.length === 0 ||
      !formData.experienceType ||
      !formData.experienceTitle ||
      !formData.experienceDescription ||
      !formData.maxGuests ||
      !formData.pricePerPerson ||
      !formData.availability
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate phone format
    if (!validatePhone(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number with country code",
        variant: "destructive",
      });
      return;
    }

    // Validate numeric fields
    const maxGuestsNum = parseInt(formData.maxGuests);
    const priceNum = parseFloat(formData.pricePerPerson);

    if (isNaN(maxGuestsNum) || maxGuestsNum < 1 || maxGuestsNum > 20) {
      toast({
        title: "Invalid guest count",
        description: "Maximum guests must be between 1 and 20",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(priceNum) || priceNum < 10 || priceNum > 1000) {
      toast({
        title: "Invalid price",
        description: "Price per person must be between $10 and $1000",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Sanitize text inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/[\s()-]/g, ""),
        location: formData.location,
        languagesSpoken: formData.languagesSpoken,
        experienceType: formData.experienceType,
        experienceTitle: sanitizeInput(formData.experienceTitle).substring(
          0,
          100,
        ),
        experienceDescription: sanitizeInput(
          formData.experienceDescription,
        ).substring(0, 1000),
        maxGuests: maxGuestsNum,
        pricePerPerson: priceNum,
        availability: formData.availability,
        specialRequirements: formData.specialRequirements
          ? sanitizeInput(formData.specialRequirements).substring(0, 500)
          : undefined,
      };

      await createApplication(sanitizedData);

      toast({
        title: t("submitSuccess"),
        description: t("submitSuccessDesc"),
      });

      // Redirect to dashboard with success state
      router.push("/dashboard?application=submitted");
    } catch (error: any) {
      console.error("Error submitting application:", error);

      // Provide specific error messages
      let errorMessage = t("genericError");
      if (error.message?.includes("Unauthorized")) {
        errorMessage = t("sessionExpired");
      } else if (error.message?.includes("network")) {
        errorMessage = t("networkError");
      }

      toast({
        title: t("submitError"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg text-gray-600">
          {t("subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("personalInfo")}</CardTitle>
            <CardDescription>
              {t("personalInfoDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("fullName")}
                  required
                  maxLength={100}
                  aria-label="Full name"
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  maxLength={100}
                  aria-label="Email address"
                  aria-required="true"
                  aria-describedby="email-error"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+502 1234 5678"
                  required
                  maxLength={20}
                  aria-label="Phone number with country code"
                  aria-required="true"
                  aria-describedby="phone-help"
                />
                <p id="phone-help" className="text-xs text-gray-500 mt-1">
                  {t("phoneHelp")}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t("location")} *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) =>
                    handleInputChange("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectLocation")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="antigua">{t("locations.antigua")}</SelectItem>
                    <SelectItem value="lake-atitlan">{t("locations.lakeAtitlan")}</SelectItem>
                    <SelectItem value="chichicastenango">
                      {t("locations.chichicastenango")}
                    </SelectItem>
                    <SelectItem value="tikal">{t("locations.tikal")}</SelectItem>
                    <SelectItem value="semuc-champey">{t("locations.semucChampey")}</SelectItem>
                    <SelectItem value="guatemala-city">
                      {t("locations.guatemalaCity")}
                    </SelectItem>
                    <SelectItem value="quetzaltenango">
                      {t("locations.quetzaltenango")}
                    </SelectItem>
                    <SelectItem value="livingston">{t("locations.livingston")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("languagesSpoken")} *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {languages.map((language) => (
                  <div
                    key={language.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={language.value}
                      checked={formData.languagesSpoken.includes(
                        language.value,
                      )}
                      onCheckedChange={() =>
                        handleLanguageToggle(language.value)
                      }
                    />
                    <label
                      htmlFor={language.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {language.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Proposal Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("experienceProposal")}</CardTitle>
            <CardDescription>
              {t("experienceProposalDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="experienceType">{t("experienceType")} *</Label>
              <Select
                value={formData.experienceType}
                onValueChange={(value) =>
                  handleInputChange("experienceType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectExperienceType")} />
                </SelectTrigger>
                <SelectContent>
                  {experienceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceTitle">{t("experienceTitle")} *</Label>
              <Input
                id="experienceTitle"
                value={formData.experienceTitle}
                onChange={(e) =>
                  handleInputChange("experienceTitle", e.target.value)
                }
                placeholder={t("experienceTitlePlaceholder")}
                required
                maxLength={100}
                aria-label="Experience title"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceDescription">
                {t("experienceDescription")} *
              </Label>
              <Textarea
                id="experienceDescription"
                value={formData.experienceDescription}
                onChange={(e) =>
                  handleInputChange("experienceDescription", e.target.value)
                }
                placeholder={t("experienceDescPlaceholder")}
                rows={6}
                required
                maxLength={1000}
                aria-label="Experience description"
                aria-required="true"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("charactersCount", { count: formData.experienceDescription.length, max: 1000 })}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">{t("maxGuests")} *</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxGuests}
                  onChange={(e) =>
                    handleInputChange("maxGuests", e.target.value)
                  }
                  placeholder={t("maxGuestsPlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerPerson">{t("pricePerPerson")} *</Label>
                <Input
                  id="pricePerPerson"
                  type="number"
                  min="10"
                  step="0.01"
                  value={formData.pricePerPerson}
                  onChange={(e) =>
                    handleInputChange("pricePerPerson", e.target.value)
                  }
                  placeholder={t("pricePlaceholder")}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("availability")} *</Label>
              <RadioGroup
                value={formData.availability}
                onValueChange={(value) =>
                  handleInputChange("availability", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekdays" id="weekdays" />
                  <label htmlFor="weekdays">{t("weekdaysOnly")}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekends" id="weekends" />
                  <label htmlFor="weekends">{t("weekendsOnly")}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <label htmlFor="flexible">{t("flexible")}</label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">
                {t("specialRequirements")}
              </Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) =>
                  handleInputChange("specialRequirements", e.target.value)
                }
                placeholder={t("specialRequirementsPlaceholder")}
                rows={4}
                maxLength={500}
                aria-label="Special requirements or notes"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("charactersCount", { count: formData.specialRequirements.length, max: 500 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
