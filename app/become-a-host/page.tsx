"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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

const languages = [
  { value: "spanish", label: "Spanish" },
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "kiche", label: "K'iche'" },
  { value: "kaqchikel", label: "Kaqchikel" },
];

const experienceTypes = [
  { value: "cooking", label: "Cooking Classes" },
  { value: "artisanal", label: "Artisanal Workshops" },
  { value: "cultural", label: "Cultural Tours" },
  { value: "nature", label: "Nature & Adventure" },
  { value: "historical", label: "Historical Tours" },
  { value: "spiritual", label: "Spiritual Experiences" },
  { value: "agricultural", label: "Agricultural Experiences" },
  { value: "textile", label: "Textile Workshops" },
];

export default function BecomeAHostPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const createApplication = useMutation(api.hostApplications.createApplication);

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
        title: "Application submitted!",
        description:
          "We'll review your application and get back to you within 48 hours.",
      });

      // Redirect to dashboard with success state
      router.push("/dashboard?application=submitted");
    } catch (error: any) {
      console.error("Error submitting application:", error);

      // Provide specific error messages
      let errorMessage =
        "There was an error submitting your application. Please try again.";
      if (error.message?.includes("Unauthorized")) {
        errorMessage = "Your session has expired. Please sign in again.";
      } else if (error.message?.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Submission failed",
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
        <h1 className="text-4xl font-bold mb-4">Become a Host</h1>
        <p className="text-lg text-gray-600">
          Share your unique cultural experiences with travelers from around the
          world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Tell us about yourself so we can get to know you better
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                  aria-label="Full name"
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
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
                <Label htmlFor="phone">Phone Number *</Label>
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
                  Include country code (e.g., +502 for Guatemala)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) =>
                    handleInputChange("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="antigua">Antigua</SelectItem>
                    <SelectItem value="lake-atitlan">Lake Atitlán</SelectItem>
                    <SelectItem value="chichicastenango">
                      Chichicastenango
                    </SelectItem>
                    <SelectItem value="tikal">Tikal</SelectItem>
                    <SelectItem value="semuc-champey">Semuc Champey</SelectItem>
                    <SelectItem value="guatemala-city">
                      Guatemala City
                    </SelectItem>
                    <SelectItem value="quetzaltenango">
                      Quetzaltenango
                    </SelectItem>
                    <SelectItem value="livingston">Livingston</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Languages Spoken *</Label>
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
            <CardTitle>Experience Proposal</CardTitle>
            <CardDescription>
              Describe the experience you&apos;d like to offer to travelers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="experienceType">Experience Type *</Label>
              <Select
                value={formData.experienceType}
                onValueChange={(value) =>
                  handleInputChange("experienceType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience type" />
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
              <Label htmlFor="experienceTitle">Experience Title *</Label>
              <Input
                id="experienceTitle"
                value={formData.experienceTitle}
                onChange={(e) =>
                  handleInputChange("experienceTitle", e.target.value)
                }
                placeholder="e.g., Traditional Mayan Cooking Class"
                required
                maxLength={100}
                aria-label="Experience title"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceDescription">
                Experience Description *
              </Label>
              <Textarea
                id="experienceDescription"
                value={formData.experienceDescription}
                onChange={(e) =>
                  handleInputChange("experienceDescription", e.target.value)
                }
                placeholder="Describe what travelers will experience, what's included, and what makes it unique..."
                rows={6}
                required
                maxLength={1000}
                aria-label="Experience description"
                aria-required="true"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.experienceDescription.length}/1000 characters
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Maximum Guests *</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxGuests}
                  onChange={(e) =>
                    handleInputChange("maxGuests", e.target.value)
                  }
                  placeholder="e.g., 8"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerPerson">Price per Person (USD) *</Label>
                <Input
                  id="pricePerPerson"
                  type="number"
                  min="10"
                  step="0.01"
                  value={formData.pricePerPerson}
                  onChange={(e) =>
                    handleInputChange("pricePerPerson", e.target.value)
                  }
                  placeholder="e.g., 75.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Availability Preference *</Label>
              <RadioGroup
                value={formData.availability}
                onValueChange={(value) =>
                  handleInputChange("availability", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekdays" id="weekdays" />
                  <label htmlFor="weekdays">Weekdays only</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekends" id="weekends" />
                  <label htmlFor="weekends">Weekends only</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <label htmlFor="flexible">Flexible (any day)</label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">
                Special Requirements or Notes (Optional)
              </Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) =>
                  handleInputChange("specialRequirements", e.target.value)
                }
                placeholder="Any special equipment, dietary restrictions, or other requirements..."
                rows={4}
                maxLength={500}
                aria-label="Special requirements or notes"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.specialRequirements.length}/500 characters
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
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  );
}
