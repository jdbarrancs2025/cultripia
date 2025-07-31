# Cultripia – Design Guidelines

## Brand voice & tone

- **Adventurous** – evoke exploration.
- **Transforming** – underscore personal growth.
- **Purposeful** – clear, action-oriented copy.

## Color palette

| Name        | Hex         | Usage                  | AA on white?         |
| ----------- | ----------- | ---------------------- | -------------------- |
| Turquesa    | **#009D9B** | Primary buttons, links | ✅                   |
| Dorado      | **#B59A32** | Accent icons, badges   | ⚠ (fails body text) |
| Dorado-Dark | **#8C7626** | Small text variant     | ✅                   |
| Gris 80 %   | **#4F4F4F** | Body copy              | ✅                   |
| Gris 90 %   | **#333333** | Headings               | ✅                   |
| Blanco      | **#FFFFFF** | Background             | —                    |

## UI Framework & Components

- **Tailwind CSS** for utility-first styling with custom color palette
- **shadcn/ui** for accessible, consistent components
- **Key shadcn components to use**:
  - `Button` - for CTAs, form actions ("Reserva ahora", "Buscar")
  - `Card` - for experience listings, dashboard widgets
  - `Input`, `Select`, `Textarea` - for forms (host application, booking)
  - `Calendar` - for date selection and availability management
  - `Dialog` - for modals (booking confirmation, host approval)
  - `Badge` - for status indicators (approved, pending, booked)
  - `Dropdown Menu` - for filters, user menu, language toggle
  - `Table` - for admin dashboard, booking lists
- **Customization**: Override shadcn defaults with Cultripia color palette

## Typography

- **Baloo 2** – headings (700), body (400).
- System UI stack as fallback.
- Apply via Tailwind CSS font utilities and shadcn component styling

## Layout & breakpoints

- **Desktop-first** base at ≥ 1280 px with mobile optimization.
- Responsive breakpoints: 1280 px, 1024 px, 768 px, 480 px.
- Cards: rounded-2xl, soft shadow, ≥ p-4.
- Buttons: bold text, full-width ≤ 768 px.
- Touch targets ≥ 44 px; hamburger menu appears ≤ 768 px.

## Experience cards & grid layout

- **Grid**: 3-column desktop layout, responsive stacking for mobile
- **Card structure** (top to bottom):
  - Hero image (aspect ratio ~16:9)
  - Experience title (H3 weight, #333333)
  - Brief description (2-3 lines max, #4F4F4F)
  - Location with pin icon (#4F4F4F)
  - Guest capacity with people icon ("Up to X guests", #4F4F4F)
  - Host info with person icon ("Hosted by [Name]", #4F4F4F)
  - Price section: amount in Turquesa (#009D9B) + "per person" in gray (#4F4F4F)
  - "Reserva ahora" CTA button (full-width, Turquesa background #009D9B)
- **Page header**: "Experiencias Cultripia" + right-aligned "Filtros" dropdown
- **Card spacing**: consistent padding, rounded corners, subtle shadow

## Landing page search interface

- **Hero section**: Large background image with overlay text
- **Search form** centered with 4 inputs:
  - "¿Dónde?" - Location dropdown
  - "Cuándo" - Date picker
  - "Quién" - Guest count input
  - "Buscar" - Primary CTA button (Turquesa)
- **Form styling**: White background, rounded inputs, proper spacing

## Calendar & date inputs

- **Date picker component**: Consistent with hero search styling
- **Host calendar view**:
  - Available dates: light background, selectable
  - Blocked dates: gray (#4F4F4F) background, "Blocked" text
  - Booked dates: red accent, "Booked" text, non-editable
- **Traveler date picker**: Only show available dates as selectable
- **Calendar controls**: Clear navigation, month/year selection
- **Mobile calendar**: Touch-friendly date selection, proper sizing

## Accessibility must-dos

- Visible focus ring (#009D9B, 2 px).
- Alt text auto-filled from listing title.
- Form fields labelled & ARIA where needed.
- Calendar navigation keyboard accessible.
- Color contrast meets WCAG AA standards.

## Content style guide

- Use H2, short intro, then bullets.
- ≤ 20-word sentences; active voice.
- Link text describes the action ("View host profile").
- UI keys grouped per language; no mixed-language phrases.
- Experience descriptions: 2-3 lines maximum on cards.
- CTA buttons: verb + object format ("Reserva ahora", "Ver detalles").
