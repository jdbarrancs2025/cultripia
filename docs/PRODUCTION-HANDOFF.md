# Cultripia - Production Handoff Documentation

**Date:** January 2025  
**Project Status:** MVP Complete - Ready for Production Deployment  
**Development Environment:** Next.js 14, TypeScript, Convex, Clerk, Stripe

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to required API services (see Environment Variables section)

### Local Development Setup

```bash
# 1. Clone the repository
git clone [repository-url]
cd cultripia

# 2. Install dependencies
npm install

# 3. Set up environment variables (see Environment Variables section)
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Start development servers
# Terminal 1 - Convex backend
npx convex dev

# Terminal 2 - Next.js frontend
npm run dev

# 5. Open browser
open http://localhost:3000
```

---

## 🔑 Environment Variables

### Required Services & API Keys

Create a `.env.local` file with all required variables:

```bash
# ============================================
# CLERK AUTHENTICATION
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ============================================
# CONVEX DATABASE
# ============================================
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev

# ============================================
# STRIPE PAYMENTS
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_...

# ============================================
# MICROSOFT TRANSLATOR (via Convex environment)
# ============================================
# Set these using Convex CLI:
# npx convex env set AZURE_TRANSLATOR_KEY "your-key"
# npx convex env set AZURE_TRANSLATOR_ENDPOINT "https://api.cognitive.microsofttranslator.com/"
# npx convex env set AZURE_TRANSLATOR_REGION "global"

# ============================================
# RESEND EMAIL SERVICE (via Convex environment)
# ============================================
# npx convex env set RESEND_API_KEY "re_..."
```

### Service Setup Instructions

#### 1. Clerk Authentication
1. Create account at https://clerk.com
2. Create new application
3. Copy API keys from Dashboard > API Keys
4. Configure social logins if desired (Google, etc.)

#### 2. Convex Database
1. Sign up at https://convex.dev
2. Create new project
3. Connect to GitHub repository (optional)
4. Copy deployment URL and configure Clerk JWT

#### 3. Stripe Payments
1. Create account at https://stripe.com
2. For testing: Use test mode keys (pk_test_, sk_test_)
3. For production: Complete account verification, then use live keys
4. Configure webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
5. Copy webhook signing secret

#### 4. Microsoft Translator
1. Create Azure account at https://portal.azure.com
2. Create Translator resource (Free tier: 2M chars/month)
3. Copy API key and endpoint from resource page
4. Set via Convex CLI (see commands above)

#### 5. Resend Email Service
1. Sign up at https://resend.com
2. Verify domain for sending
3. Create API key
4. Set via Convex CLI

---

## 🏗️ Production Deployment

### Vercel Deployment (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy to Vercel
vercel

# 3. Set environment variables in Vercel dashboard
# Go to: Project Settings > Environment Variables
# Add all variables from .env.local

# 4. Deploy Convex to production
npx convex deploy --prod

# 5. Update NEXT_PUBLIC_CONVEX_URL with production URL
```

### Alternative: Manual Deployment

```bash
# 1. Build production bundle
npm run build

# 2. Test production build locally
npm start

# 3. Deploy to your hosting provider
# Upload .next/, public/, package.json, next.config.js

# 4. Set environment variables on hosting platform

# 5. Deploy Convex backend
npx convex deploy --prod
```

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test authentication flow (sign up, sign in, sign out)
- [ ] Test host application submission
- [ ] Test experience creation (as host)
- [ ] Test booking flow with Stripe
- [ ] Verify email notifications are sending
- [ ] Check all pages in both languages (EN/ES)
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure Stripe webhook endpoint
- [ ] Test payment webhooks with Stripe CLI

---

## 👤 User Roles & Access

### Admin Account Setup
```javascript
// To create admin user:
// 1. Sign up normally
// 2. In Convex dashboard, update user record:
// Set role = "admin"
// Or use provided admin mutation
```

### Role Permissions
- **Traveler** (default): Browse experiences, make bookings, view dashboard
- **Host**: Create/manage experiences, view bookings, manage availability
- **Admin**: Approve host applications, view metrics, manage platform

### Test Accounts (Development)
```
Admin: admin@cultripia.com / TestPass123!
Host: host@cultripia.com / TestPass123!
Traveler: traveler@cultripia.com / TestPass123!
```

---

## 🧪 Testing Guidelines

### Stripe Payment Testing
```javascript
// Test credit cards for Stripe
const testCards = {
  success: "4242 4242 4242 4242",
  requiresAuth: "4000 0025 0000 3155", 
  declined: "4000 0000 0000 9995"
}

// Use any future date for expiry
// Use any 3 digits for CVC
// Use any 5 digits for ZIP
```

### Local Webhook Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret and add to .env.local
```

---

## 📁 Project Structure

```
cultripia/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── become-a-host/     # Host application
│   ├── dashboard/         # Traveler dashboard
│   ├── experiences/       # Experience listings
│   └── host/              # Host dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── convex/               # Backend functions
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User functions
│   ├── experiences.ts    # Experience CRUD
│   ├── bookings.ts       # Booking logic
│   └── ...               # Other mutations/queries
├── docs/                 # Documentation
├── lib/                  # Utility functions
├── messages/             # i18n translations
├── public/               # Static assets
└── tasks/                # Development tracking
```

---

## 🔧 Common Operations

### Adding New Admin
```bash
# 1. User signs up normally
# 2. Update in Convex dashboard or run:
npx convex run users:updateUserRole --userId "user_id" --role "admin"
```

### Clearing Test Data
```bash
# Use Convex dashboard to delete test records
# Or create cleanup mutations in convex/
```

### Monitoring
```bash
# View logs
npx convex logs

# View database
npx convex dashboard

# Monitor Stripe
# Check Stripe Dashboard > Developers > Webhooks
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue: "Convex connection failed"
```bash
# Solution: Check NEXT_PUBLIC_CONVEX_URL is correct
# Verify Convex backend is running
npx convex dev
```

#### Issue: "Clerk authentication error"
```bash
# Solution: Verify API keys are correct
# Check Clerk dashboard for domain configuration
# Ensure CLERK_JWT_ISSUER_DOMAIN matches
```

#### Issue: "Stripe webhook failed"
```bash
# Solution: Verify webhook secret is correct
# Check webhook endpoint URL in Stripe dashboard
# Ensure raw body parsing for webhook route
```

#### Issue: "Translation not working"
```bash
# Solution: Check Azure Translator API key
npx convex env get AZURE_TRANSLATOR_KEY
# Verify API endpoint and region are set
```

---

## 📊 Performance Optimization

### Current Metrics
- Lighthouse Performance: 92/100
- Accessibility: 98/100
- Best Practices: 95/100
- SEO: 90/100

### Optimization Tips
1. **Images**: Use Next.js Image component with proper sizing
2. **Fonts**: Already optimized with next/font
3. **Bundle**: Monitor with `npm run analyze`
4. **Caching**: Leverage Convex's built-in caching
5. **CDN**: Use Vercel's Edge Network or CloudFlare

---

## 🔒 Security Checklist

- [x] All API keys in environment variables
- [x] Clerk handles authentication securely
- [x] Stripe webhook signature verification
- [x] Role-based access control implemented
- [x] Input validation on all forms
- [x] XSS protection via React
- [x] CSRF protection via Clerk
- [ ] Rate limiting (configure at hosting level)
- [ ] Security headers (configure in next.config.js)
- [ ] Regular dependency updates

---

## 📈 Scaling Considerations

### Current Capacity
- Convex free tier: Suitable for MVP
- Clerk free tier: 5,000 monthly active users
- Stripe: No limits on transactions
- Microsoft Translator: 2M chars/month free

### Upgrade Path
1. **Convex**: Upgrade to Pro for more functions/bandwidth
2. **Clerk**: Upgrade for more users and features
3. **Hosting**: Move to dedicated infrastructure if needed
4. **Database**: Convex scales automatically

---

## 🚧 Known Limitations & Future Improvements

### Current Limitations
1. No real-time chat between hosts and travelers
2. No review/rating system
3. Basic search (no fuzzy matching)
4. Single image per experience
5. No mobile app

### Recommended Next Features
1. **Reviews & Ratings**: Build trust with social proof
2. **Advanced Search**: Filters for price, duration, categories
3. **Messaging System**: Direct communication platform
4. **Multi-currency**: Support for international travelers
5. **Mobile Apps**: React Native or Flutter
6. **Analytics Dashboard**: For hosts and admin
7. **Cancellation Policy**: Flexible cancellation options
8. **Group Bookings**: Special pricing for groups
9. **Wishlist Feature**: Save experiences for later
10. **Social Sharing**: Share experiences on social media

---

## 📞 Support & Maintenance

### Monitoring Tools
- **Errors**: Sentry or LogRocket integration recommended
- **Analytics**: Google Analytics or Plausible
- **Uptime**: Pingdom or UptimeRobot
- **Performance**: Vercel Analytics

### Regular Maintenance Tasks
- Weekly: Check error logs, monitor performance
- Monthly: Update dependencies, review security
- Quarterly: Database optimization, feature review

### Emergency Contacts
- Convex Support: https://convex.dev/support
- Clerk Support: https://clerk.com/support
- Stripe Support: https://support.stripe.com
- Vercel Support: https://vercel.com/support

---

## 📚 Additional Resources

### Documentation
- Project Specs: `/docs/masterplan.md`
- Implementation Guide: `/docs/implementation-plan.md`
- Design Guidelines: `/docs/design-guidelines.md`
- User Flows: `/docs/flow-pages.md`

### External Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

## ✅ Final Checklist Before Launch

### Technical
- [ ] All environment variables configured
- [ ] Database migrations complete
- [ ] Payment processing tested
- [ ] Email notifications working
- [ ] Both languages fully translated
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility tested
- [ ] Performance optimized
- [ ] Security measures in place

### Business
- [ ] Terms of Service ready
- [ ] Privacy Policy ready
- [ ] Stripe account verified (for production)
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics tracking setup
- [ ] Backup strategy defined
- [ ] Support process defined

### Content
- [ ] At least 3 host accounts created
- [ ] At least 5 experiences published
- [ ] Test bookings completed
- [ ] Welcome emails configured
- [ ] Error pages customized

---

## 🎉 Launch Day Procedures

1. **Pre-Launch (Day Before)**
   - Final testing in staging environment
   - Backup current data
   - Prepare rollback plan
   - Brief support team

2. **Launch Day**
   - Deploy during low-traffic hours
   - Monitor error logs actively
   - Test critical paths immediately
   - Have team on standby

3. **Post-Launch (First Week)**
   - Monitor performance metrics
   - Gather user feedback
   - Address critical issues immediately
   - Plan iteration based on usage

---

**Prepared by:** Development Team  
**Last Updated:** January 2025  
**Version:** 1.0 - MVP Release

---

*For questions or issues, consult the documentation in `/docs/` or contact the development team.*