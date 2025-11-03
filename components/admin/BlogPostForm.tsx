"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MarkdownEditor } from "@/components/blog/MarkdownEditor";
import { generateSlug } from "@/lib/generateSlug";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogPostFormData {
  titleEn: string;
  titleEs: string;
  contentEn: string;
  contentEs: string;
  excerptEn: string;
  excerptEs: string;
  slugEn: string;
  slugEs: string;
  featuredImageUrl?: string;
  status: "draft" | "published" | "archived";
}

interface BlogPostFormProps {
  initialData?: BlogPostFormData & { _id: Id<"blogPosts"> };
  isEditing?: boolean;
}

export function BlogPostForm({ initialData, isEditing = false }: BlogPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createPost = useMutation(api.blogPosts.createBlogPost);
  const updatePost = useMutation(api.blogPosts.updateBlogPost);

  const [formData, setFormData] = useState<BlogPostFormData>({
    titleEn: initialData?.titleEn || "",
    titleEs: initialData?.titleEs || "",
    contentEn: initialData?.contentEn || "",
    contentEs: initialData?.contentEs || "",
    excerptEn: initialData?.excerptEn || "",
    excerptEs: initialData?.excerptEs || "",
    slugEn: initialData?.slugEn || "",
    slugEs: initialData?.slugEs || "",
    featuredImageUrl: initialData?.featuredImageUrl || "",
    status: initialData?.status || "draft",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugsManuallyEdited, setSlugsManuallyEdited] = useState({
    en: !!initialData?.slugEn,
    es: !!initialData?.slugEs,
  });

  // Auto-generate slugs from titles
  useEffect(() => {
    if (!slugsManuallyEdited.en && formData.titleEn) {
      setFormData((prev) => ({
        ...prev,
        slugEn: generateSlug(formData.titleEn),
      }));
    }
  }, [formData.titleEn, slugsManuallyEdited.en]);

  useEffect(() => {
    if (!slugsManuallyEdited.es && formData.titleEs) {
      setFormData((prev) => ({
        ...prev,
        slugEs: generateSlug(formData.titleEs),
      }));
    }
  }, [formData.titleEs, slugsManuallyEdited.es]);

  const handleSubmit = async (e: React.FormEvent, saveStatus?: "draft" | "published") => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.titleEn.trim() || !formData.titleEs.trim()) {
        throw new Error("Title is required in both languages");
      }
      if (!formData.contentEn.trim() || !formData.contentEs.trim()) {
        throw new Error("Content is required in both languages");
      }
      if (!formData.excerptEn.trim() || !formData.excerptEs.trim()) {
        throw new Error("Excerpt is required in both languages");
      }
      if (formData.excerptEn.length > 200 || formData.excerptEs.length > 200) {
        throw new Error("Excerpt must be 200 characters or less");
      }

      const finalStatus = saveStatus || formData.status;

      if (isEditing && initialData) {
        await updatePost({
          postId: initialData._id,
          titleEn: formData.titleEn,
          titleEs: formData.titleEs,
          contentEn: formData.contentEn,
          contentEs: formData.contentEs,
          excerptEn: formData.excerptEn,
          excerptEs: formData.excerptEs,
          slugEn: formData.slugEn,
          slugEs: formData.slugEs,
          featuredImageUrl: formData.featuredImageUrl || undefined,
          status: finalStatus,
        });

        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        await createPost({
          titleEn: formData.titleEn,
          titleEs: formData.titleEs,
          contentEn: formData.contentEn,
          contentEs: formData.contentEs,
          excerptEn: formData.excerptEn,
          excerptEs: formData.excerptEs,
          slugEn: formData.slugEn,
          slugEs: formData.slugEs,
          featuredImageUrl: formData.featuredImageUrl || undefined,
          status: finalStatus,
        });

        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: "draft" | "published" | "archived") =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* English Section */}
      <div className="border-l-4 border-blue-500 pl-6 space-y-4">
        <h2 className="text-xl font-semibold">English Content</h2>

        <div className="space-y-2">
          <Label htmlFor="titleEn">Title (EN) *</Label>
          <Input
            id="titleEn"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
            placeholder="Enter English title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slugEn">Slug (EN) *</Label>
          <Input
            id="slugEn"
            value={formData.slugEn}
            onChange={(e) => {
              setFormData({ ...formData, slugEn: e.target.value });
              setSlugsManuallyEdited({ ...slugsManuallyEdited, en: true });
            }}
            placeholder="auto-generated-from-title"
            required
          />
          <p className="text-xs text-muted-foreground">
            Auto-generated from title. Edit to customize.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerptEn">Excerpt (EN) * (max 200 chars)</Label>
          <Textarea
            id="excerptEn"
            value={formData.excerptEn}
            onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
            placeholder="Brief summary of the post..."
            maxLength={200}
            rows={3}
            required
          />
          <p className="text-xs text-muted-foreground">
            {formData.excerptEn.length}/200 characters
          </p>
        </div>

        <MarkdownEditor
          value={formData.contentEn}
          onChange={(value) => setFormData({ ...formData, contentEn: value })}
          label="Content (EN) *"
          placeholder="Write your English content in Markdown..."
        />
      </div>

      {/* Spanish Section */}
      <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
        <h2 className="text-xl font-semibold">Spanish Content</h2>

        <div className="space-y-2">
          <Label htmlFor="titleEs">Título (ES) *</Label>
          <Input
            id="titleEs"
            value={formData.titleEs}
            onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
            placeholder="Ingrese el título en español"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slugEs">Slug (ES) *</Label>
          <Input
            id="slugEs"
            value={formData.slugEs}
            onChange={(e) => {
              setFormData({ ...formData, slugEs: e.target.value });
              setSlugsManuallyEdited({ ...slugsManuallyEdited, es: true });
            }}
            placeholder="auto-generado-del-titulo"
            required
          />
          <p className="text-xs text-muted-foreground">
            Auto-generado del título. Edite para personalizar.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerptEs">Extracto (ES) * (máx 200 caracteres)</Label>
          <Textarea
            id="excerptEs"
            value={formData.excerptEs}
            onChange={(e) => setFormData({ ...formData, excerptEs: e.target.value })}
            placeholder="Breve resumen del artículo..."
            maxLength={200}
            rows={3}
            required
          />
          <p className="text-xs text-muted-foreground">
            {formData.excerptEs.length}/200 caracteres
          </p>
        </div>

        <MarkdownEditor
          value={formData.contentEs}
          onChange={(value) => setFormData({ ...formData, contentEs: value })}
          label="Contenido (ES) *"
          placeholder="Escriba su contenido en español usando Markdown..."
        />
      </div>

      {/* Featured Image */}
      <div className="space-y-2">
        <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
        <Input
          id="featuredImageUrl"
          type="url"
          value={formData.featuredImageUrl}
          onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-muted-foreground">
          Optional. Enter a direct URL to an image.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
        </Button>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e, "draft")}
          >
            Save as Draft
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/blog")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
