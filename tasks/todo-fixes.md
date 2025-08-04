# Internationalization (i18n) Fixes Todo List

## Overview
This document tracks the internationalization fixes for Cultripia. We have 19 pages that need i18n implementation, organized into 4 phases by priority.

## Core Principles (from CLAUDE.md)
- **Simplicity first** - Keep translations simple and functional
- **One task at a time** - Complete each page before moving to the next
- **Follow existing patterns** - Use the working examples from dashboard, experiences, and host dashboard pages
- **Test both languages** - Verify English and Spanish work correctly

## Translation Pattern to Follow
```typescript
// Import at the top
import { useTranslations, useLocale } from "next-intl";

// Inside component
const t = useTranslations("namespace");
const locale = useLocale();

// Replace hardcoded text
// BAD: <h1>Welcome</h1>
// GOOD: <h1>{t("welcome")}</h1>
```

---

## PHASE 1: Critical User-Facing Pages (High Priority)

### Booking Flow Pages

#### [COMPLETED] Fix i18n in `/app/booking/success/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook ✓
- Create translation namespace "bookingSuccess" ✓
- Replace all hardcoded Spanish text with t() calls ✓
- Add keys to messages/en.json and messages/es.json ✓
- Test booking success flow in both languages ✓

#### [COMPLETED] Fix i18n in `/app/booking/cancel/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook ✓
- Create translation namespace "bookingCancel" ✓
- Replace all hardcoded Spanish text with t() calls ✓
- Add keys to messages/en.json and messages/es.json ✓
- Test booking cancellation flow in both languages ✓

#### [COMPLETED] Fix i18n in `/app/(main)/dashboard/bookings/[bookingId]/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook ✓
- Create translation namespace "bookingDetails" ✓
- Replace all hardcoded Spanish text with t() calls ✓
- Add keys to messages/en.json and messages/es.json ✓
- Test booking details page in both languages ✓

### Host Application & Management Pages

#### [COMPLETED] Fix i18n in `/app/become-a-host/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook ✓
- Create translation namespace "becomeHost" ✓
- Replace all hardcoded English text with t() calls ✓
- Add keys to messages/en.json and messages/es.json ✓
- Test host application form in both languages ✓

#### [COMPLETED] Fix i18n in `/app/host/experiences/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook ✓
- Create translation namespace "hostExperiences" ✓
- Replace all hardcoded English text with t() calls ✓
- Add keys to messages/en.json and messages/es.json ✓
- Test host experiences list in both languages ✓

#### [COMPLETED] Fix i18n in `/app/host/experiences/new/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook ✓
- Create translation namespace "createExperience" ✓
- Replace all hardcoded English text with t() calls ✓
- Add keys to messages/en.json and messages/es.json ✓
- Test experience creation form in both languages ✓

#### [COMPLETED] Fix i18n in `/app/host/experiences/[id]/edit/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook ✓
- Create translation namespace "editExperience" ✓
- Replace all hardcoded English text with t() calls ✓
- Add keys to messages/en.json and messages/es.json ✓
- Test experience editing in both languages ✓

### Main Pages & Components

#### [COMPLETED] Fix i18n in `/app/page.tsx` and its components
**Acceptance criteria:**
- Check HeroSection component for hardcoded text ✓
- Check FeaturedExperiences component for hardcoded text ✓
- Import useTranslations in components if needed ✓
- Add any missing translation keys ✓
- Test landing page in both languages ✓

#### [COMPLETED] Fix i18n in `/app/experiences/[id]/page.tsx` and its components
**Acceptance criteria:**
- Check ExperienceDetailContent component for hardcoded text ✓
- Import useTranslations in components if needed ✓
- Create translation namespace "experienceDetail" ✓
- Add all necessary translation keys ✓
- Test experience detail page in both languages ✓

---

## PHASE 2: Host Tools (Medium Priority)

#### [COMPLETED] Fix i18n in `/app/host/experiences/[id]/availability/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook ✓
- Create translation namespace "availability" ✓
- Replace all hardcoded Spanish text with t() calls ✓
- Add keys to messages/en.json and messages/es.json ✓
- Test availability management in both languages ✓

---

## PHASE 3: Admin Pages (Medium Priority)

#### [COMPLETED] Fix i18n in `/app/admin/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook
- Create translation namespace "adminOverview"
- Replace all hardcoded English text with t() calls
- Add keys to messages/en.json and messages/es.json

#### [COMPLETED] Fix i18n in `/app/admin/dashboard/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook
- Create translation namespace "adminDashboard"
- Replace all hardcoded Spanish text with t() calls
- Add keys to messages/en.json and messages/es.json

#### [COMPLETED] Fix i18n in `/app/admin/applications/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook
- Create translation namespace "adminApplications"
- Replace all hardcoded English text with t() calls
- Add keys to messages/en.json and messages/es.json

#### [COMPLETED] Fix i18n in `/app/admin/experiences/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook
- Create translation namespace "adminExperiences"
- Replace all hardcoded English text with t() calls
- Add keys to messages/en.json and messages/es.json

#### [COMPLETED] Fix i18n in `/app/admin/hosts/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook
- Create translation namespace "adminHosts"
- Replace all hardcoded English text with t() calls
- Add keys to messages/en.json and messages/es.json

#### [COMPLETED] Fix i18n in `/app/admin/settings/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook
- Create translation namespace "adminSettings"
- Replace minimal hardcoded text with t() calls
- Add keys to messages/en.json and messages/es.json

#### [COMPLETED] Fix i18n in `/app/admin/test-data/page.tsx`
**Acceptance criteria:**
- Import useTranslations hook
- Create translation namespace "adminTestData"
- Replace all hardcoded English text with t() calls
- Add keys to messages/en.json and messages/es.json

---

## PHASE 4: Low Priority Pages

#### [WONTFIX] Check `/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
**Acceptance criteria:**
- Verify if Clerk handles i18n internally ✓
- If Clerk doesn't support i18n, mark as WONTFIX (not a priority) ✓
- Document findings ✓

**Findings:** This page uses the `<SignIn />` component from Clerk, which handles its own internationalization internally. No custom i18n implementation needed.

#### [WONTFIX] Check `/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
**Acceptance criteria:**
- Verify if Clerk handles i18n internally ✓
- If Clerk doesn't support i18n, mark as WONTFIX (not a priority) ✓
- Document findings ✓

**Findings:** This page uses the `<SignUp />` component from Clerk, which handles its own internationalization internally. No custom i18n implementation needed.

---

## Testing Checklist for Each Page
- [ ] Page loads without errors
- [ ] All text displays correctly in English
- [ ] All text displays correctly in Spanish
- [ ] Language switcher works (if present)
- [ ] No console errors related to missing translations
- [ ] Forms and interactions work in both languages

## Notes
- Use existing translation files as reference: `/messages/en.json` and `/messages/es.json`
- Follow the naming convention for translation keys (camelCase, descriptive)
- Group related translations under appropriate namespaces
- Keep translations concise and culturally appropriate