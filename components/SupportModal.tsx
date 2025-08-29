"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const t = useTranslations("support");
  const { toast } = useToast();
  const createSupportRequest = useMutation(api.support.createSupportRequest);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("emailInvalid");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("messageTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createSupportRequest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setFormData({ name: "", email: "", message: "" });
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("successTitle")}</h3>
            <p className="text-center text-gray-600">{t("successMessage")}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("modalTitle")}</DialogTitle>
              <DialogDescription>{t("modalDescription")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("nameLabel")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isSubmitting}
                  maxLength={100}
                  aria-label={t("nameLabel")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-500 mt-1" role="alert">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isSubmitting}
                  maxLength={255}
                  aria-label={t("emailLabel")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500 mt-1" role="alert">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="message">{t("messageLabel")}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder={t("messagePlaceholder")}
                  className={errors.message ? "border-red-500" : ""}
                  rows={5}
                  disabled={isSubmitting}
                  maxLength={5000}
                  aria-label={t("messageLabel")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="text-sm text-red-500 mt-1" role="alert">{errors.message}</p>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t("cancelButton")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-turquesa hover:bg-turquesa/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("submittingButton")}
                    </>
                  ) : (
                    t("submitButton")
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}