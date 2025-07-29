# Cultripia - Project Handoff Documentation

## Overview
This document contains important information for the project handoff, including setup instructions, API configurations, and key implementation notes.

## Development Progress
- **Completed Steps**: 1-11 (Repository setup through DeepL Translation Integration)
- **Next Step**: Step 12 (Experience Detail Page)
- **Total Steps**: 19

## Environment Setup

### Required Environment Variables
Create a `.env.local` file with the following variables:

```bash
# Clerk Authentication (Already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Zm9uZC1zcG9uZ2UtNTQuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_rqMaXbeiJeqhZ722uVWsO0tt8bUk6uuaVUjwTZ3YtX

# Clerk URLs (Already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex (Already configured)
CONVEX_DEPLOYMENT=dev:avid-kingfisher-625
NEXT_PUBLIC_CONVEX_URL=https://avid-kingfisher-625.convex.cloud
CLERK_JWT_ISSUER_DOMAIN=https://fond-sponge-54.clerk.accounts.dev

# DeepL API (Needs to be configured)
# Run: npx convex env set DEEPL_API_KEY "your-deepl-api-key"
```

## DeepL Translation Integration

### Important Note about DeepL API Access

The DeepL translation feature has been implemented to work with the **official DeepL API**. 

#### For Official DeepL API:
1. Sign up at https://www.deepl.com/pro-api
2. Get your API key from the DeepL dashboard
3. Set the environment variable:
   ```bash
   npx convex env set DEEPL_API_KEY "your-deepl-api-key"
   ```
4. The API key format should look like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx`

#### RapidAPI Alternative (NOT COMPATIBLE with current code):
If using RapidAPI's DeepL service, the current implementation **will NOT work** because:
- RapidAPI uses different authentication headers (`X-RapidAPI-Key` and `X-RapidAPI-Host`)
- RapidAPI uses a different endpoint URL
- The request format may differ

**Current Implementation** uses:
- Endpoint: `https://api-free.deepl.com/v2/translate`
- Authentication: `Authorization: DeepL-Auth-Key [yourAuthKey]`

**RapidAPI would require**:
- Different endpoint (e.g., `https://deep-translate.p.rapidapi.com/translate`)
- Different headers: `X-RapidAPI-Key` and `X-RapidAPI-Host`

### Translation Feature Overview
- Hosts can write experience content in their preferred language (English or Spanish)
- Content is automatically translated to the other language on form submission
- Both language versions are saved and can be edited independently
- The original language is tracked in the database

## Running the Project

### Development Mode
```bash
# Terminal 1 - Run Convex backend
npx convex dev

# Terminal 2 - Run Next.js frontend
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Key Features Implemented

### 1. Authentication (Clerk)
- User roles: traveler, host, admin
- Role-based navigation and access control
- Automatic user creation on first sign-in

### 2. Host Application Flow
- Multi-step application form
- Admin approval workflow
- Automatic role upgrade upon approval

### 3. Experience Management
- CRUD operations for experiences
- Bilingual content (English/Spanish)
- Image upload via Convex storage
- Draft/Active status management

### 4. Calendar System
- Host availability management
- Traveler date selection with availability filtering
- Visual calendar interface

### 5. Search and Filtering
- Location-based filtering
- Guest count filtering
- Date availability filtering
- Pagination support

## Upcoming Features (Not Yet Implemented)

### Step 12: Experience Detail Page
- Individual experience view
- Booking form integration
- Calendar integration for date selection

### Step 13: Stripe Checkout Integration
- Payment processing
- Webhook handling
- Booking confirmation

### Step 14-15: Dashboard Pages
- Host dashboard with metrics
- Traveler booking management

### Step 16: Email Notifications
- Resend integration
- Booking confirmations
- Host notifications

### Step 17: Internationalization
- next-intl setup
- Language switcher
- Complete UI translations

## Known Limitations
1. DeepL translation requires API key (not included)
2. Stripe integration pending
3. Email notifications not yet implemented
4. Full internationalization pending

## Support Resources
- Next.js Documentation: https://nextjs.org/docs
- Convex Documentation: https://docs.convex.dev
- Clerk Documentation: https://clerk.com/docs
- shadcn/ui Documentation: https://ui.shadcn.com

## Contact
For questions about the implementation, refer to:
- `/docs/masterplan.md` - Overall project architecture
- `/docs/implementation-plan.md` - Step-by-step build guide
- `/docs/design-guidelines.md` - UI/UX specifications
- `/tasks/todo.md` - Detailed task breakdown and progress