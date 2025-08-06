# Cultripia

A cultural experiences marketplace connecting travelers with authentic local experiences. Built as a 4-week MVP project.

## Overview

Cultripia is an Airbnb-style platform focused exclusively on cultural experiences (no lodging). It enables local hosts to offer authentic cultural activities to travelers, with support for multiple languages and countries.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend/Database**: Convex (real-time, serverless)
- **Authentication**: Clerk (with role-based access)
- **Payments**: Stripe Checkout
- **Emails**: Resend
- **Translation**: Microsoft Translator API
- **Internationalization**: next-intl (EN/ES)
- **Hosting**: Vercel-ready

## Quick Start

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd cultripia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and add your API keys:
   ```bash
   cp .env.example .env.local
   ```
   
   See `/docs/PRODUCTION-HANDOFF.md` for detailed setup instructions.

4. **Start development servers**
   
   Terminal 1 - Convex backend:
   ```bash
   npx convex dev
   ```
   
   Terminal 2 - Next.js frontend:
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
cultripia/
├── app/                 # Next.js app directory
│   ├── (auth)/         # Authentication pages
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes (webhooks, emails)
│   ├── become-a-host/  # Host application flow
│   ├── dashboard/      # Traveler dashboard
│   ├── experiences/    # Experience listings & details
│   └── host/           # Host dashboard & management
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   └── ...             # Feature-specific components
├── convex/             # Backend functions
│   ├── schema.ts       # Database schema
│   ├── users.ts        # User management
│   ├── experiences.ts  # Experience CRUD
│   ├── bookings.ts     # Booking logic
│   └── ...             # Other mutations/queries
├── docs/               # Documentation
│   ├── masterplan.md   # Project architecture
│   ├── implementation-plan.md  # Build guide
│   ├── design-guidelines.md    # UI/UX specs
│   └── PRODUCTION-HANDOFF.md   # Deployment guide
├── lib/                # Utility functions
├── messages/           # i18n translations (EN/ES)
├── public/             # Static assets
└── tasks/              # Development tracking

```

## Key Features

### For Travelers
- Browse cultural experiences by location
- Filter by date and guest count
- Secure booking with Stripe
- Bilingual interface (English/Spanish)
- Personal dashboard for managing bookings

### For Hosts
- Apply to become a host
- Create and manage experiences
- Bilingual content support
- Calendar availability management
- Booking notifications
- Revenue tracking

### For Admins
- Review and approve host applications
- Platform metrics dashboard
- User management
- Content moderation

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx convex dev       # Start Convex backend
npx convex deploy    # Deploy Convex to production
```

## Documentation

- **Production Deployment**: See `/docs/PRODUCTION-HANDOFF.md`
- **Architecture**: See `/docs/masterplan.md`
- **Implementation Details**: See `/docs/implementation-plan.md`
- **Design Guidelines**: See `/docs/design-guidelines.md`
- **User Flows**: See `/docs/flow-pages.md`

## Testing

### Stripe Payments (Test Mode)
Use these test cards:
- Success: `4242 4242 4242 4242`
- Authentication Required: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

### Local Webhook Testing
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Deployment

### Vercel (Recommended)
```bash
vercel
npx convex deploy --prod
```

See `/docs/PRODUCTION-HANDOFF.md` for complete deployment instructions.

## Environment Variables

Required services:
- Clerk (Authentication)
- Convex (Database)
- Stripe (Payments)
- Microsoft Translator (Translations)
- Resend (Emails)

Full setup instructions in `/docs/PRODUCTION-HANDOFF.md`

## Support

For deployment and configuration support, refer to:
- `/docs/PRODUCTION-HANDOFF.md` - Complete deployment guide
- `/docs/masterplan.md` - Project architecture
- `/tasks/todo.md` - Development progress tracker

## License

Private project - All rights reserved

---

**Version**: 1.0.0 (MVP)  
**Status**: Production-ready  
**Last Updated**: January 2025
