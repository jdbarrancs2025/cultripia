/**
 * Utility functions for YouTube video embedding
 */

/**
 * Converts a YouTube video ID to a proper embed URL
 * @param videoId - The YouTube video ID (e.g., "dQw4w9WgXcQ")
 * @returns The complete YouTube embed URL with security parameters
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new Error(`Invalid YouTube video ID: ${videoId}`);
  }
  
  // Standard embed format with security and UX parameters
  return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`;
}

/**
 * Validates if a string is a valid YouTube video ID format
 * YouTube video IDs are typically 11 characters long and contain alphanumeric characters, hyphens, and underscores
 * @param videoId - The video ID to validate
 * @returns true if the video ID appears to be valid format
 */
export function isValidYouTubeVideoId(videoId: string): boolean {
  if (!videoId || typeof videoId !== 'string') {
    return false;
  }
  
  // YouTube video IDs are typically 11 characters long
  // and contain only alphanumeric characters, hyphens, and underscores
  const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  return videoIdRegex.test(videoId);
}

/**
 * Extracts video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * @param url - The YouTube URL
 * @returns The extracted video ID or null if not found
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // Handle youtu.be format
  const shortUrlMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortUrlMatch) {
    return shortUrlMatch[1];
  }
  
  // Handle youtube.com watch format
  const longUrlMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longUrlMatch) {
    return longUrlMatch[1];
  }
  
  return null;
}

/**
 * YouTube iframe component props for consistent styling
 */
export interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Default iframe attributes for YouTube embeds with security and accessibility
 */
export const defaultYouTubeIframeProps = {
  frameBorder: "0",
  allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  allowFullScreen: true,
} as const;