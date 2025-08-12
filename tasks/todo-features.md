# Cultripia Feature Development Tasks

## Overview

This document tracks development tasks for new Cultripia features: multi-image carousel and YouTube video integration. Each task is atomic and should take 10-15 minutes to complete. Features must be implemented in the simplest way possible following CLAUDE.md development rules.

**EXECUTION REQUIREMENTS:**
- Tasks MUST be completed sequentially in the exact order listed
- After completing each task, mark it as `[COMPLETED]`  
- After each task completion, run the **code-quality-enforcer** agent until no errors or security vulnerabilities are found
- Only proceed to the next task after code-quality-enforcer gives all-clear
- Follow CLAUDE.md development workflow strictly

---

## NEW FEATURE 1: Multi-Image Carousel Support

### [COMPLETED] Add optional image fields to experiences schema

**Reference:** `/docs/masterplan.md` data model, current `convex/schema.ts`
**Acceptance criteria:**

- Add `additionalImageUrls: v.optional(v.array(v.string()))` to experiences table
- Keep existing `imageUrl: v.string()` field unchanged for backward compatibility
- Schema allows up to 7 additional images (8 total with primary)
- No breaking changes to existing experiences data
- TypeScript types updated automatically

### [COMPLETED] Add optional YouTube video field to experiences schema

**Reference:** `/docs/masterplan.md` data model, current `convex/schema.ts` 
**Acceptance criteria:**

- Add `youtubeVideoId: v.optional(v.string())` to experiences table
- Field stores only the video ID (e.g., "dQw4w9WgXcQ"), not full URL
- Field is completely optional
- No breaking changes to existing experiences data
- TypeScript types updated automatically

---

## NEW FEATURE 2: Universal Media Carousel Component

### [COMPLETED] Create MediaCarousel component using shadcn/ui

**Reference:** `/docs/design-guidelines.md` component usage, existing `/components/ui/experience-card.tsx` patterns
**Acceptance criteria:**

- Create `/components/ui/media-carousel.tsx` 
- Uses shadcn/ui Carousel component internally
- Props: `primaryImage: string`, `additionalImages?: string[]`, `youtubeVideoId?: string`, `alt: string`
- Shows static image if only primaryImage provided (no carousel UI)
- Shows carousel with navigation if multiple media items
- Responsive design (desktop-first, mobile-optimized)
- YouTube videos render as iframe embeds within carousel slides

### [COMPLETED] Create YouTube video embed utility

**Reference:** Current image handling patterns, `/docs/masterplan.md` tech stack
**Acceptance criteria:**

- Create utility function to convert YouTube video ID to embed URL
- Handle standard embed format: `https://www.youtube.com/embed/{videoId}`
- Add basic iframe with responsive aspect ratio styling
- Include standard YouTube embed parameters (no autoplay)
- Error handling for invalid video IDs

---

## NEW FEATURE 3: Update Experience Display Components

### [COMPLETED] Replace Image with MediaCarousel in ExperienceCard

**Reference:** `/components/ui/experience-card.tsx`, `/docs/design-guidelines.md` card layout
**Acceptance criteria:**

- Replace single `<Image>` component with `<MediaCarousel>` 
- Pass `experience.imageUrl`, `experience.additionalImageUrls`, `experience.youtubeVideoId` as props
- Maintain existing card aspect ratio and layout
- Graceful fallback to placeholder if no images
- Carousel indicators visible when multiple media items
- No changes to card dimensions or responsive behavior

### [COMPLETED] Replace Image with MediaCarousel in ExperienceHero

**Reference:** `/components/experience-detail/ExperienceHero.tsx`, `/docs/design-guidelines.md` detail page
**Acceptance criteria:**

- Replace single `<Image>` component with `<MediaCarousel>`
- Pass all experience media data as props
- Maintain existing hero section height and styling
- Full-width carousel display
- Navigation controls visible when multiple media items
- Gradient overlay preserved over carousel

### [COMPLETED] Update any other experience image displays

**Reference:** Main page, explore page, other experience display locations
**Acceptance criteria:**

- Search codebase for other experience image displays
- Replace with MediaCarousel component using same pattern
- Ensure consistent behavior across all experience displays
- Maintain responsive design and accessibility
- Test all locations render correctly

---

## NEW FEATURE 4: Host Experience Form Updates

### [COMPLETED] Add additional images upload to experience form

**Reference:** Current experience form structure, `/docs/implementation-plan.md` image upload
**Acceptance criteria:**

- Add "Additional Images" section below existing primary image upload
- Multi-file upload input allowing up to 7 additional images
- Image preview for each uploaded additional image
- Upload to Convex file storage using existing patterns
- Validation: max 7 additional images, same size/format rules as primary
- Loading states during upload process

### [COMPLETED] Add YouTube video field to experience form

**Reference:** Current experience form structure, `/docs/masterplan.md` YouTube integration
**Acceptance criteria:**

- Add "YouTube Video (Optional)" text input field
- Accept full YouTube URLs and extract video ID automatically
- Validation: ensure valid YouTube URL format
- Preview embedded video when valid URL entered
- Clear error messages for invalid URLs
- Field completely optional - form submits without video

### [COMPLETED] Update experience create/update mutations

**Reference:** Current experience CRUD operations in `/convex/`
**Acceptance criteria:**

- Update `createExperience` mutation to handle new optional fields
- Update `updateExperience` mutation to handle new optional fields
- Save additional image URLs array to database
- Save extracted YouTube video ID to database
- Preserve existing mutation behavior for backward compatibility
- Handle cases where new fields are undefined/empty

---

## NEW FEATURE 5: Testing and Quality Assurance

### [IN PROGRESS] Test carousel functionality across all displays

**Reference:** `/docs/design-guidelines.md` responsive design requirements
**Acceptance criteria:**

- Test single image experiences show no carousel (static image)
- Test multiple image experiences show functional carousel
- Test YouTube video integration works in carousel
- Test mobile responsiveness of carousel navigation
- Test keyboard accessibility for carousel controls
- Verify loading states and error handling

### [ ] Test backward compatibility with existing experiences

**Reference:** Current experience data structure, existing experience displays
**Acceptance criteria:**

- Existing experiences with only primary image continue working unchanged
- No console errors or TypeScript errors after changes
- All existing experience displays render correctly
- Performance testing shows no significant degradation
- Database queries handle optional fields correctly

---

## Completion Checklist

- [ ] Up to 8 images per experience supported
- [ ] YouTube videos integrate into carousel seamlessly  
- [ ] All experience displays use consistent carousel component
- [ ] Backward compatibility maintained for existing experiences
- [ ] Host forms allow adding additional media easily
- [ ] Mobile responsive carousel navigation works
- [ ] No breaking changes to existing functionality
- [ ] Code follows CLAUDE.md simplicity principles