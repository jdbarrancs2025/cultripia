"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload, Image as ImageIcon, Languages } from "lucide-react";
import { useAction } from "convex/react";

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

export default function NewExperiencePage() {
  const router = useRouter();
  const t = useTranslations("createExperience");
  const createExperience = useMutation(api.experiences.createExperience);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getImageUrl = useMutation(api.files.getUrl);
  const translateContent = useAction(api.translator.translateExperienceContent);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [primaryLanguage, setPrimaryLanguage] = useState<"EN" | "ES">("EN");
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: "",
    titleEs: "",
    descEn: "",
    descEs: "",
    location: "",
    maxGuests: 1,
    priceUsd: 0,
    imageUrl: "",
    status: "draft" as "draft" | "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsTranslating(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error(t("uploadFailed"));
        }
      }

      // Validate image URL
      if (!imageUrl) {
        throw new Error("Please provide an image for your experience");
      }

      // Prepare the data with translations
      let finalData = { ...formData, imageUrl };

      // Get the primary language content
      const title =
        primaryLanguage === "EN" ? formData.titleEn : formData.titleEs;
      const description =
        primaryLanguage === "EN" ? formData.descEn : formData.descEs;

      // Only translate if we have content in the primary language
      if (title && description) {
        try {
          toast.info("Translating your content...", {
            description: "This may take a moment",
          });

          const translation = await translateContent({
            title,
            description,
            sourceLang: primaryLanguage,
          });

          // Update the translated fields
          if (primaryLanguage === "EN") {
            finalData.titleEs = translation.translatedTitle;
            finalData.descEs = translation.translatedDescription;
          } else {
            finalData.titleEn = translation.translatedTitle;
            finalData.descEn = translation.translatedDescription;
          }

          toast.success("Content translated successfully");
        } catch (translationError) {
          console.error("Translation error:", translationError);
          toast.warning("Translation failed", {
            description: "You can add translations manually later.",
          });
        }
      }

      setIsTranslating(false);

      const experienceId = await createExperience({
        ...finalData,
        originalLanguage: primaryLanguage,
      });

      toast.success(t("experienceCreated"), {
        description: t("redirecting"),
      });

      router.push("/host/experiences");
    } catch (error) {
      console.error("Error creating experience:", error);
      toast.error(t("errorCreating"), {
        description:
          error instanceof Error ? error.message : t("tryAgain"),
      });
    } finally {
      setIsSubmitting(false);
      setIsTranslating(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;

    setIsUploading(true);
    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      }).catch((error) => {
        console.error("Network error during upload:", error);
        throw new Error(
          "Network error: Please check your connection and try again",
        );
      });

      if (!result.ok) {
        throw new Error(
          `Upload failed: ${result.statusText || "Unknown error"}`,
        );
      }

      const { storageId } = await result.json();

      // Get the public URL for the uploaded image
      const imageUrl = await getImageUrl({ storageId });
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-gray-600 mt-2">
          {t("subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("basicInfo")}</CardTitle>
            <CardDescription>
              {t("basicInfoDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selector */}
            <div className="space-y-2">
              <Label htmlFor="language">{t("primaryLanguage")}</Label>
              <Select
                value={primaryLanguage}
                onValueChange={(value) =>
                  setPrimaryLanguage(value as "EN" | "ES")
                }
              >
                <SelectTrigger id="language" className="w-full md:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="ES">Español</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t("writeInPreferredLanguage")}
              </p>
            </div>

            {/* Title Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  {primaryLanguage === "EN" ? t("titleEnglish") : t("titleSpanish")}
                </Label>
                <Input
                  id="title"
                  placeholder={
                    primaryLanguage === "EN"
                      ? t("titleEnglishPlaceholder")
                      : t("titleSpanishPlaceholder")
                  }
                  value={
                    primaryLanguage === "EN"
                      ? formData.titleEn
                      : formData.titleEs
                  }
                  onChange={(e) =>
                    handleInputChange(
                      primaryLanguage === "EN" ? "titleEn" : "titleEs",
                      e.target.value,
                    )
                  }
                  required
                />
              </div>

              {/* Show translated title if available */}
              {((primaryLanguage === "EN" && formData.titleEs) ||
                (primaryLanguage === "ES" && formData.titleEn)) && (
                <div className="space-y-2">
                  <Label htmlFor="titleTranslated">
                    {primaryLanguage === "EN"
                      ? t("titleSpanishAuto")
                      : t("titleEnglishAuto")}
                  </Label>
                  <Input
                    id="titleTranslated"
                    value={
                      primaryLanguage === "EN"
                        ? formData.titleEs
                        : formData.titleEn
                    }
                    onChange={(e) =>
                      handleInputChange(
                        primaryLanguage === "EN" ? "titleEs" : "titleEn",
                        e.target.value,
                      )
                    }
                    className="bg-muted/50"
                  />
                </div>
              )}
            </div>

            {/* Description Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">
                  {primaryLanguage === "EN" ? t("descriptionEnglish") : t("descriptionSpanish")}
                </Label>
                <Textarea
                  id="description"
                  placeholder={
                    primaryLanguage === "EN"
                      ? t("descriptionEnglishPlaceholder")
                      : t("descriptionSpanishPlaceholder")
                  }
                  rows={4}
                  value={
                    primaryLanguage === "EN" ? formData.descEn : formData.descEs
                  }
                  onChange={(e) =>
                    handleInputChange(
                      primaryLanguage === "EN" ? "descEn" : "descEs",
                      e.target.value,
                    )
                  }
                  required
                />
              </div>

              {/* Show translated description if available */}
              {((primaryLanguage === "EN" && formData.descEs) ||
                (primaryLanguage === "ES" && formData.descEn)) && (
                <div className="space-y-2">
                  <Label htmlFor="descriptionTranslated">
                    {primaryLanguage === "EN"
                      ? t("descriptionSpanishAuto")
                      : t("descriptionEnglishAuto")}
                  </Label>
                  <Textarea
                    id="descriptionTranslated"
                    rows={4}
                    value={
                      primaryLanguage === "EN"
                        ? formData.descEs
                        : formData.descEn
                    }
                    onChange={(e) =>
                      handleInputChange(
                        primaryLanguage === "EN" ? "descEs" : "descEn",
                        e.target.value,
                      )
                    }
                    className="bg-muted/50"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("location")}</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleInputChange("location", value)}
                required
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder={t("selectLocation")} />
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

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">{t("maxGuests")}</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxGuests}
                  onChange={(e) =>
                    handleInputChange(
                      "maxGuests",
                      parseInt(e.target.value) || 1,
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceUsd">{t("pricePerPerson")}</Label>
                <Input
                  id="priceUsd"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceUsd}
                  onChange={(e) =>
                    handleInputChange(
                      "priceUsd",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("experienceImage")}</Label>
              <div className="space-y-4">
                {imagePreview || formData.imageUrl ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Experience preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview("");
                        setSelectedImage(null);
                        setFormData((prev) => ({ ...prev, imageUrl: "" }));
                      }}
                    >
                      {t("remove")}
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {t("clickToUpload")}
                          </span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageSelect}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {t("imageUploadHint")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="url"
                      placeholder={t("orPasteUrl")}
                      value={formData.imageUrl}
                      onChange={(e) => {
                        handleInputChange("imageUrl", e.target.value);
                        setSelectedImage(null);
                        setImagePreview("");
                      }}
                      disabled={!!selectedImage || isUploading}
                    />
                  </div>
                  {!imagePreview && !formData.imageUrl && (
                    <label htmlFor="image-upload">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUploading}
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading ? t("uploading") : t("chooseFile")}
                        </span>
                      </Button>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/host/experiences")}
          >
            {t("cancel")}
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || isUploading || isTranslating}
            className="md:w-auto w-full"
          >
            {isTranslating
              ? t("translating")
              : isSubmitting
                ? t("creating")
                : t("saveAsDraft")}
          </Button>

          <Button
            type="button"
            onClick={() => {
              setFormData((prev) => ({ ...prev, status: "active" }));
              const form = document.querySelector("form") as HTMLFormElement;
              form?.requestSubmit();
            }}
            disabled={isSubmitting || isUploading || isTranslating}
            className="bg-turquesa hover:bg-turquesa/90 md:w-auto w-full"
          >
            {isTranslating
              ? t("translating")
              : isSubmitting
                ? t("publishing")
                : t("saveAndPublish")}
          </Button>
        </div>
      </form>
    </div>
  );
}
