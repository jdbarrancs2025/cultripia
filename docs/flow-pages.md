# Cultripia – App Flow, Pages & Roles

## Site map (top‑level pages)

- `/` Landing
- `/signup`
- `/host/apply`
- `/experiences` (grid)
  - `/experiences/[id]`
- `/dashboard/traveler`
- `/dashboard/host`
- `/dashboard/admin`

## Purpose of each page (one‑liner)

- **Landing** – explain value + location/date search interface + strong CTA.
- **Signup** – Clerk auth.
- **Host Apply** – collect profile; auto‑translate test fields.
- **Experiences** – browse/filter by location with card grid layout and filters dropdown.
- **Experience Detail** – view available dates, select date, book & pay.
- **Traveler Dashboard** – manage bookings & view upcoming/past experiences.
- **Host Dashboard** – manage listings, calendar availability & view bookings.
- **Admin Dashboard** – metrics + approval queues.

## User roles & access levels

| Page             | Traveler | Host         | Admin |
| ---------------- | -------- | ------------ | ----- |
| Landing / Signup | ✅       | ✅           | ✅    |
| Host Apply       | —        | ✅ (pending) | ✅    |
| Experiences      | ✅       | ✅           | ✅    |
| Dashboards       | Own only | Own only     | All   |

## Primary user journeys (≤ 3 steps each)

1. **Book experience** – Browse by location/date ➜ Experience detail + date selection ➜ Pay (Stripe Checkout).
2. **Become host** – Sign up ➜ Apply ➜ Await approval email.
3. **Approve host** (admin) – Dashboard ➜ Review application ➜ Approve.
4. **Manage availability** (host) – Dashboard ➜ Calendar ➜ Block/unblock dates.

## Key user flows

### Landing Page Search Flow

1. User selects location from dropdown ("¿Dónde?")
2. User selects date from date picker ("Cuándo")
3. User enters guest count ("Quién")
4. User clicks "Buscar" → redirects to `/experiences` with filters applied

### Experience Booking Flow

1. User browses experiences grid with location/price/host info
2. User clicks "Reserva ahora" → goes to experience detail page
3. User selects available date from calendar widget
4. User enters guest quantity (up to maxGuests limit)
5. User clicks book → Stripe Checkout → confirmation

### Host Calendar Management

1. Host accesses dashboard calendar view
2. Host can block dates (gray), unblock dates (green)
3. Booked dates auto-blocked (red) and non-editable
4. Changes save automatically to availability table
