"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Upload, Image as ImageIcon, Loader2, Languages } from "lucide-react"
import { useAction } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"

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
  "Panajachel"
]

export default function EditExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const experienceId = params.id as Id<"experiences">
  
  const experience = useQuery(api.experiences.getExperience, { id: experienceId })
  const updateExperience = useMutation(api.experiences.updateExperience)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const getImageUrl = useMutation(api.files.getUrl)
  const translateContent = useAction(api.deepl.translateExperienceContent)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [primaryLanguage, setPrimaryLanguage] = useState<"EN" | "ES">("EN")
  const [isTranslating, setIsTranslating] = useState(false)
  const [formData, setFormData] = useState({
    titleEn: "",
    titleEs: "",
    descEn: "",
    descEs: "",
    location: "",
    maxGuests: 1,
    priceUsd: 0,
    imageUrl: "",
    status: "draft" as "draft" | "active" | "inactive"
  })

  // Load experience data when available
  useEffect(() => {
    if (experience) {
      setFormData({
        titleEn: experience.titleEn,
        titleEs: experience.titleEs,
        descEn: experience.descEn,
        descEs: experience.descEs,
        location: experience.location,
        maxGuests: experience.maxGuests,
        priceUsd: experience.priceUsd,
        imageUrl: experience.imageUrl,
        status: experience.status,
      })
    }
  }, [experience])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = formData.imageUrl

      // Upload image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          throw new Error("Failed to upload image")
        }
      }

      // Validate image URL
      if (!imageUrl) {
        throw new Error("Please provide an image for your experience")
      }

      await updateExperience({
        experienceId,
        ...formData,
        imageUrl
      })
      
      toast.success("Experience updated successfully", {
        description: "Your changes have been saved.",
      })
      
      router.push("/host/experiences")
    } catch (error) {
      console.error("Error updating experience:", error)
      toast.error("Error updating experience", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file.",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB.",
      })
      return
    }

    setSelectedImage(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async () => {
    if (!selectedImage) return null

    setIsUploading(true)
    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl()

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      }).catch((error) => {
        console.error("Network error during upload:", error)
        throw new Error("Network error: Please check your connection and try again")
      })

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText || 'Unknown error'}`)
      }

      const { storageId } = await result.json()
      
      // Get the public URL for the uploaded image
      const imageUrl = await getImageUrl({ storageId })
      return imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  if (!experience) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-16">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Experience</h1>
        <p className="text-gray-600 mt-2">
          Update your experience details and manage availability.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the essential details about your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="titleEn">Title (English)</Label>
                <Input
                  id="titleEn"
                  placeholder="e.g., Traditional Cooking Class in Antigua"
                  value={formData.titleEn}
                  onChange={(e) => handleInputChange("titleEn", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="titleEs">Title (Spanish)</Label>
                <Input
                  id="titleEs"
                  placeholder="e.g., Clase de Cocina Tradicional en Antigua"
                  value={formData.titleEs}
                  onChange={(e) => handleInputChange("titleEs", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="descEn">Description (English)</Label>
                <Textarea
                  id="descEn"
                  placeholder="Describe your experience in detail..."
                  rows={4}
                  value={formData.descEn}
                  onChange={(e) => handleInputChange("descEn", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descEs">Description (Spanish)</Label>
                <Textarea
                  id="descEs"
                  placeholder="Describe tu experiencia en detalle..."
                  rows={4}
                  value={formData.descEs}
                  onChange={(e) => handleInputChange("descEs", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => handleInputChange("location", value)}
                required
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
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

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Maximum Guests</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxGuests}
                  onChange={(e) => handleInputChange("maxGuests", parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priceUsd">Price per Person (USD)</Label>
                <Input
                  id="priceUsd"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceUsd}
                  onChange={(e) => handleInputChange("priceUsd", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "draft" | "active" | "inactive") => handleInputChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Experience Image</Label>
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
                        setImagePreview("")
                        setSelectedImage(null)
                        if (experience.imageUrl !== formData.imageUrl) {
                          setFormData(prev => ({ ...prev, imageUrl: experience.imageUrl }))
                        }
                      }}
                    >
                      {imagePreview ? "Remove New" : "Change"}
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Click to upload or drag and drop
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
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="url"
                      placeholder="Or paste an image URL"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        handleInputChange("imageUrl", e.target.value)
                        setSelectedImage(null)
                        setImagePreview("")
                      }}
                      disabled={!!selectedImage || isUploading}
                    />
                  </div>
                  {!imagePreview && (
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" disabled={isUploading} asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading ? "Uploading..." : "Choose File"}
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
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/host/experiences/${experienceId}/availability`)}
          >
            Manage Availability
          </Button>
          
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/host/experiences")}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-turquesa hover:bg-turquesa/90 md:w-auto w-full"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}