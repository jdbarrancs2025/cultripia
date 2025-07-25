# Cultripia – Implementation Plan

## Step-by-step build sequence (mindless micro-tasks)  
1. **Repo & CI** – scaffold Next.js with TypeScript, add Tailwind CSS + shadcn/ui, Convex, Clerk, Vercel env vars.    
2. **Auth flows** – Clerk provider, role tagging, protected routes.    
3. **DB schema** – deploy Convex tables (users, applications, experiences, availability, bookings).    
4. **Landing page with search** – hero section + location/date/guest search form.
5. **Host application form → admin queue.**    
6. **Admin dashboard** – metrics widget + approval queue interface.    
7. **Experiences grid page** – 3-column card layout with location/guest/host/price display.
8. **Filters dropdown** – location-based filtering system for experiences.
9. **Calendar system** – host availability management + traveler date picker components.
10. **Experience CRUD** – create/edit form with single image via Convex file storage.    
11. **DeepL translate-on-submit** – hosts write in preferred language, auto-translate to other language on form submit (editable after translation).    
12. **Experience detail page** – show experience info + available date selection + booking form.
13. **Stripe Checkout** – create session with selected date/guests, store `sessionId`; webhook marks booking paid.    
14. **Host dashboard** – calendar view for blocking dates + manage listings + view bookings.
15. **Traveler dashboard** – upcoming / past bookings with experience details.    
16. **Email triggers** – Resend for bookings confirmation + host-approval notifications.    
17. **UI strings** – next-intl setup; language toggle in navbar.    
18. **Browser-first responsiveness QA** – Lighthouse mobile & desktop at each demo.    
19. **Loom walkthrough + Notion hand-off doc.**

## Database schema details
```
users: {
  id: string,
  clerkId: string,
  role: "traveler" | "host" | "admin",
  name: string,
  email: string,
  createdAt: timestamp
}

hostApplications: {
  id: string,
  userId: string,
  status: "pending" | "approved" | "rejected",
  applicationData: object,
  createdAt: timestamp
}

experiences: {
  id: string,
  hostId: string,
  titleEn: string,
  titleEs: string,
  descEn: string,
  descEs: string,
  location: string,
  maxGuests: number,
  priceUsd: number,
  imageUrl: string,
  status: "draft" | "active" | "inactive",
  createdAt: timestamp
}

availability: {
  id: string,
  experienceId: string,
  date: string, // YYYY-MM-DD format
  status: "available" | "blocked" | "booked"
}

bookings: {
  id: string,
  experienceId: string,
  travelerId: string,
  qtyPersons: number,
  selectedDate: string, // YYYY-MM-DD format
  stripeSessionId: string,
  paid: boolean,
  totalAmount: number,
  createdAt: timestamp
}
```

## Key component specifications

### Landing Search Form
- Use shadcn `Select` for location dropdown with predefined destinations
- Use shadcn `Calendar` component for date picker
- Use shadcn `Input` for guest count with +/- `Button` controls
- Search `Button` (variant="default") redirects to `/experiences?location=X&date=Y&guests=Z`

### Experience Card Component
- Use shadcn `Card` with `CardHeader`, `CardContent`, `CardFooter`
- Image with proper aspect ratio and loading states
- Title truncation after 2 lines using Tailwind line-clamp
- Description truncation after 3 lines with Tailwind utilities
- Icons for location, capacity, host (lucide-react)
- Price formatting with currency using Tailwind typography
- "Reserva ahora" shadcn `Button` with hover states

### Calendar Components
- Host calendar: shadcn `Calendar` with custom day styling for availability states
- Traveler date picker: shadcn `Calendar` with disabled prop for unavailable dates
- Visual states using Tailwind classes: available (default), blocked (bg-gray-100), booked (bg-red-100)
- Mobile-responsive with proper touch targets

### Dashboard Layouts
- Use shadcn `Card` components for metric widgets
- Use shadcn `Table` for listings, bookings, and admin queues
- Use shadcn `Badge` for status indicators (approved/pending/booked)
- Navigation with shadcn `Button` variants

## Timeline checkpoints  
| Week | Milestone | Demo deliverable |  
|------|-----------|------------------|  
| 0 | Kick-off & architecture | Repo + CI green |  
| 1 | Auth + landing + experiences grid | Live search + grid display |  
| 2 | Host flow + calendar + admin | Calendar management + host approval |  
| 3 | Booking flow + Stripe + detail pages | Live paid booking with date selection |  
| 4 | Dashboards + email + QA | Full user journeys working; Loom hand-off |

## Translation workflow details
1. Host creates experience in their preferred language (EN or ES)
2. On form submit, DeepL API translates to the other language
3. System saves both versions to database
4. Host can later edit both language versions independently
5. Traveler sees experience in their selected language

## Optional integrations / stretch goals  
- Sentry (errors), Vercel Analytics, Cloudinary swap if images > 1 GB.
- Advanced filtering (price range, experience type, duration)
- Host onboarding tour/tutorial
- Experience reviews and ratings system