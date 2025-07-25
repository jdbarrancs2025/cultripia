# Cultripia

Airbnb-style marketplace for cultural experiences (no lodging).

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend/Database**: Convex
- **Authentication**: Clerk
- **Payments**: Stripe Checkout
- **Emails**: Resend
- **Translation**: DeepL API
- **Internationalization**: next-intl
- **Hosting**: Vercel

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   
   # Convex
   CONVEX_DEPLOYMENT=
   NEXT_PUBLIC_CONVEX_URL=
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. In a separate terminal, run Convex:
   ```bash
   npm run convex
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
cultripia/
├── app/              # Next.js app directory
├── components/       # React components
├── convex/          # Convex backend functions
├── lib/             # Utility functions
├── messages/        # i18n translation files
├── docs/            # Project documentation
└── public/          # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run convex` - Start Convex development