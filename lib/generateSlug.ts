/**
 * Generate a URL-friendly slug from a title
 * Removes special characters, converts to lowercase, replaces spaces with hyphens
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Remove accents and special characters
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Remove all non-alphanumeric characters except hyphens
    .replace(/[^\w-]+/g, "")
    // Replace multiple consecutive hyphens with a single hyphen
    .replace(/-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");
}
