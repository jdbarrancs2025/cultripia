# Cultripia - Project Handoff Documentation

## Overview

This document contains important information for the project handoff, including setup instructions, API configurations, and key implementation notes.

## Development Progress

- **Completed Steps**: 1-12 (Repository setup through Experience Detail Page)
- **Current Step**: Step 13 (Stripe Checkout Integration)
- **Total Steps**: 19

⚠️ **IMPORTANT**: See "CRITICAL REQUIREMENTS FOR STEP 13" section below for Stripe implementation details

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

# Microsoft Translator API (Needs to be configured)
# Run: npx convex env set AZURE_TRANSLATOR_KEY "your-azure-translator-key"
# Run: npx convex env set AZURE_TRANSLATOR_ENDPOINT "https://api.cognitive.microsofttranslator.com/"
# Run: npx convex env set AZURE_TRANSLATOR_REGION "global"
```

## Microsoft Translator Integration

### Important Note about Microsoft Translator API Access

The translation feature has been implemented to work with the **Microsoft Translator API**.

#### For Microsoft Translator API:

1. Sign up for Azure and create a Translator resource at https://portal.azure.com
2. Get your API key and endpoint from the Azure portal
3. Set the environment variables:
   ```bash
   npx convex env set AZURE_TRANSLATOR_KEY "your-azure-translator-key"
   npx convex env set AZURE_TRANSLATOR_ENDPOINT "https://api.cognitive.microsofttranslator.com/"
   npx convex env set AZURE_TRANSLATOR_REGION "global"
   ```

#### Free Tier Details:

- **Free tier**: 2 million characters per month
- **Languages**: 100+ languages supported
- **Quality**: Enterprise-grade translation quality

**Current Implementation** uses:

- Endpoint: `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0`
- Authentication: `Ocp-Apim-Subscription-Key` header
- Region: `Ocp-Apim-Subscription-Region` header

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

### Step 12: Experience Detail Page ✅

- Individual experience view
- Booking form integration
- Calendar integration for date selection

### Step 13: Stripe Checkout Integration

- Payment processing
- Webhook handling
- Booking confirmation

#### CRITICAL REQUIREMENTS FOR STEP 13:

1. **Bookings can ONLY be confirmed after payment confirmation**
   - Do NOT mark booking as paid until Stripe webhook confirms payment
   - Implement proper webhook signature verification
2. **Pricing Structure:**
   - Each experience has a `pricePerPerson` (already in database)
   - Total price = `pricePerPerson × guestCount`
   - Calculate total dynamically at checkout time
3. **Testing in Panama (No Production Stripe Account):**
   - Use Stripe TEST MODE for all development
   - Test API keys format: `pk_test_...` and `sk_test_...`
   - Test card numbers:
     - Success: `4242 4242 4242 4242`
     - Requires auth: `4000 0025 0000 3155`
     - Declined: `4000 0000 0000 9995`
   - Test mode is FULLY SUFFICIENT for:
     - Complete payment flow testing
     - Webhook event testing
     - Success/failure scenarios
     - Demonstrating to clients
4. **Implementation Notes:**
   - Store test keys in `.env.local`:
     ```
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
     STRIPE_SECRET_KEY=sk_test_...
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```
   - Create webhook endpoint at `/api/webhooks/stripe`
   - Use Stripe CLI for local webhook testing
   - Clients can later replace with their production keys

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

1. Microsoft Translator requires API key (not included)
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
