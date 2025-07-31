# Mobile Responsiveness Test Checklist

## Test Devices
- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPad Mini (744px)
- Standard Mobile (360px)

## Pages to Test

### 1. Landing Page (/)
- [ ] Hero section scales properly
- [ ] Search form is accessible
- [ ] Date picker works on touch
- [ ] Guest selector works with touch
- [ ] Navigation menu (hamburger) works

### 2. Experiences Grid (/experiences)
- [ ] Grid changes to single column
- [ ] Cards are readable
- [ ] Filter dropdowns work
- [ ] Pagination is accessible
- [ ] Images load properly

### 3. Experience Detail (/experiences/[id])
- [ ] Image gallery works
- [ ] Booking form is accessible
- [ ] Calendar picker works
- [ ] Description text is readable
- [ ] Host info card fits screen

### 4. Host Application (/become-a-host)
- [ ] Form fields are accessible
- [ ] Text areas can be used
- [ ] Multi-selects work
- [ ] Submit button is reachable
- [ ] Validation messages visible

### 5. Traveler Dashboard (/dashboard)
- [ ] Booking cards stack properly
- [ ] Tabs are accessible
- [ ] Details modal works
- [ ] Contact buttons work
- [ ] Images scale correctly

### 6. Host Dashboard (/host/dashboard)
- [ ] Navigation tabs work
- [ ] Calendar is usable
- [ ] Tables scroll horizontally
- [ ] Actions are accessible
- [ ] Metrics cards stack

### 7. Admin Dashboard (/admin)
- [ ] Sidebar becomes hamburger
- [ ] Tables are scrollable
- [ ] Modals fit screen
- [ ] Forms are usable
- [ ] Charts/metrics readable

## Common Issues to Check
1. Touch targets minimum 44x44px
2. No horizontal scroll
3. Text readable without zoom
4. Forms have proper input types
5. Modals/dropdowns fit viewport
6. Images have proper aspect ratios
7. Navigation is accessible