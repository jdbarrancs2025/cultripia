# Cultripia – Masterplan

## 30-second elevator pitch

- Airbnb-style marketplace for **cultural experiences** (no lodging).
- Desktop-first, mobile-optimized UI ships in **≤ 4 weeks**.
- Goal: prove demand with **3 hosts · 5 experiences · 10 paid bookings**.

## Problem & mission

- **Travelers** struggle to find authentic, safe local activities.
- **Locals** lack an easy channel to monetize their skills.
- Cultripia bridges that gap—**adventurous · transforming · purposeful**.

## Target audience

- Backpackers & slow-travelers (18-40 y) fluent in EN or ES.
- Passionate locals ready to host niche cultural tours.

## Core features

- Google / email auth (Clerk) & role-based dashboards.
- Host application + admin approval.
- **Auto EN↔ES translation (Microsoft Translator)**: Hosts create content in their preferred language, system translates on form submit (editable after translation).
- **1-image** experience listings with location-based discovery and filtering.
- Host calendar management (block/unblock dates, auto-block booked dates).
- Traveler date selection with real-time availability checking.
- Landing page location + date search interface.
- Stripe Checkout instant booking (per-person pricing); 10% platform margin baked into price.
- Email notifications via Resend; UI strings via next-intl.
- Admin metrics: users · hosts · bookings · revenue.

## High-level tech stack (why it fits)

| Layer         | Choice                       | Rationale                                                |
| ------------- | ---------------------------- | -------------------------------------------------------- |
| Front-end     | **Next.js (React 18)**       | Fast dev-X, Vercel-native CI/CD                          |
| UI Framework  | **Tailwind CSS + shadcn/ui** | Rapid styling + accessible components                    |
| Back-end / DB | **Convex**                   | Real-time queries, server actions, built-in file storage |
| Auth          | **Clerk**                    | Plug-and-play OAuth + email flows                        |
| Payments      | **Stripe Checkout**          | PCI-safe hosted form, 5-line integration                 |
| Emails        | **Resend**                   | Free 3k emails/mo, trivial API                           |
| Translation   | **Microsoft Translator**     | High-quality ES ↔ EN, 2M chars/month free               |
| Hosting       | **Vercel**                   | Zero-config deploys, preview URLs                        |

## Conceptual data model (ERD in words)

- **users**: id · role · clerkId · name · profile fields
- **hostApplications**: id · userId · status
- **experiences**: id · hostId · titleEn/Es · descEn/Es · location · maxGuests · priceUsd · imageUrl · status
- **availability**: id · experienceId · date · status (available/blocked/booked)
- **bookings**: id · experienceId · travelerId · qtyPersons · selectedDate · stripeSessionId · paid · createdAt
- **siteMetrics**: daily snapshot aggregates

## UI design principles (Krug applied)

1. **Don't make me think** – one clear CTA per screen.
2. **Design for scanning** – bold headings, ≤ 20-word sentences, bullet stacks.
3. **Self-evident actions** – button labels = verb + object ("Book experience").
4. **Relentless trimming** – prune copy by 50% after each draft.

## Security & compliance notes

- HTTPS via Vercel, secure cookies only.
- Role checks in every Convex mutation.
- Stripe webhook secret stored server-side (Vercel env var).
- No extra GDPR/age restrictions beyond Clerk & Stripe defaults.

## Phased roadmap

| Phase   | Scope                                          | ETA     |
| ------- | ---------------------------------------------- | ------- |
| **MVP** | All core features above                        | ≤ 4 wks |
| **V1**  | Multi-image galleries, Stripe Connect, reviews | +6 wks  |
| **V2**  | Chat, dynamic pricing, PWA                     | +3 mo   |

## Risks & mitigations

| Risk                  | Mitigation                               |
| --------------------- | ---------------------------------------- |
| Convex 1 GB image cap | Migrate to Cloudinary if usage spikes    |
| Translation errors    | Hosts can edit auto-generated EN/ES      |
| Host quality          | Manual approval + traveler feedback loop |
