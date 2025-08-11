# Cultripia Production Deployment Tasks

## Overview

This document tracks all tasks required for deploying Cultripia to production and completing the handoff to the client. Each task is atomic and should be completed sequentially.

**Client Email Account:** [To be provided by client]  
**Domain:** [Already owned by client]  
**Stripe Account:** [Already owned by client]  

---

## PHASE 1: Service Account Setup

### [ ] Create client's Clerk account
**Reference:** `/docs/PRODUCTION-HANDOFF.md` Clerk setup
**Acceptance criteria:**
- Account created with client's email
- Application named "Cultripia Production"
- Email/password auth enabled
- Google OAuth configured (optional)
- Production API keys obtained

### [ ] Create client's Convex account
**Reference:** `/docs/PRODUCTION-HANDOFF.md` Convex setup
**Acceptance criteria:**
- Account created with client's email
- New project named "cultripia-prod"
- Production deployment URL obtained
- Clerk JWT integration configured

### [ ] Create client's Resend account
**Reference:** `/docs/PRODUCTION-HANDOFF.md` Resend setup
**Acceptance criteria:**
- Account created with client's email
- Domain verified for sending emails
- Production API key generated
- From email configured (noreply@[client-domain])

### [ ] Create client's Vercel account
**Reference:** `/docs/PRODUCTION-HANDOFF.md` Vercel setup
**Acceptance criteria:**
- Account created with client's email
- GitHub repository connected
- Project imported and named "cultripia"
- Custom domain ready to configure

### [ ] Configure Microsoft Translator (Developer managed)
**Reference:** `/docs/masterplan.md` translation integration
**Acceptance criteria:**
- Use existing developer Azure account
- API key ready for production use
- Note: This will be managed by developer, not mentioned to client
- 2M free characters/month confirmed

---

## PHASE 2: Data Cleanup (CRITICAL)

### [ ] Export admin user credentials
**Reference:** Current development database
**Acceptance criteria:**
- Document admin email and temporary password
- Ensure admin role is properly set
- Verify admin can access all admin functions

### [ ] Delete all test traveler accounts
**Reference:** Convex dashboard > users table
**Acceptance criteria:**
- Remove all users with role "traveler"
- Keep only the designated admin account
- Document number of accounts deleted

### [ ] Delete all test host accounts
**Reference:** Convex dashboard > users table
**Acceptance criteria:**
- Remove all users with role "host"
- If needed, convert one to admin as backup
- Verify no orphaned host data remains

### [ ] Delete all test experiences
**Reference:** Convex dashboard > experiences table
**Acceptance criteria:**
- Remove ALL experiences from database
- Verify experience images are also removed
- Confirm no orphaned availability records

### [ ] Delete all test bookings
**Reference:** Convex dashboard > bookings table
**Acceptance criteria:**
- Remove ALL booking records
- Verify no payment data remains
- Clear any related session data

### [ ] Delete all host applications
**Reference:** Convex dashboard > hostApplications table
**Acceptance criteria:**
- Remove ALL application records
- Both approved and pending applications
- Verify clean slate for production

### [ ] Clear availability calendar data
**Reference:** Convex dashboard > availability table
**Acceptance criteria:**
- Remove ALL availability records
- Verify calendar shows no blocked dates
- Confirm clean state for new hosts

### [ ] Clear any stored files/images
**Reference:** Convex dashboard > _storage
**Acceptance criteria:**
- Delete all uploaded test images
- Verify storage is empty or minimal
- Check storage quota is reset

### [ ] Verify database is production-ready
**Reference:** All Convex tables
**Acceptance criteria:**
- Only admin user remains in users table
- All other tables are empty
- No test data artifacts remain
- Database ready for real users

---

## PHASE 3: Environment Configuration

### [ ] Gather Stripe production credentials
**Reference:** Client's Stripe account
**Acceptance criteria:**
- Request live API keys from client
- Get publishable key (pk_live_...)
- Get secret key (sk_live_...)
- Note: Webhook secret will be generated later

### [ ] Prepare production environment variables
**Reference:** `.env.example` file
**Acceptance criteria:**
- Create complete .env.production file
- All Clerk production keys added
- All Convex production URLs added
- Stripe live keys added (from client)
- Microsoft Translator keys ready
- Resend API key added

### [ ] Configure Vercel environment variables
**Reference:** Vercel Dashboard > Settings > Environment Variables
**Acceptance criteria:**
- All variables from .env.production added
- Variables scoped to "Production" environment
- Sensitive keys marked as encrypted
- Preview deployments use separate keys

### [ ] Configure Convex environment variables
**Reference:** Convex CLI commands
**Acceptance criteria:**
- AZURE_TRANSLATOR_KEY set via CLI
- AZURE_TRANSLATOR_ENDPOINT set
- AZURE_TRANSLATOR_REGION set to "global"
- RESEND_API_KEY set via CLI
- All variables confirmed with `convex env get`

---

## PHASE 4: Domain & Hosting Setup

### [ ] Configure custom domain in Vercel
**Reference:** Vercel Dashboard > Domains
**Acceptance criteria:**
- Add client's domain to project
- DNS records provided to client
- SSL certificate auto-provisioned
- www redirect configured

### [ ] Update domain in environment variables
**Reference:** NEXT_PUBLIC_APP_URL variable
**Acceptance criteria:**
- Update to https://[client-domain].com
- Update in both Vercel and local configs
- Verify all email links use correct domain

### [ ] Configure domain in Clerk
**Reference:** Clerk Dashboard > Domains
**Acceptance criteria:**
- Production domain added
- Redirect URLs updated
- Sign-in/up URLs verified
- JWT issuer domain updated

---

## PHASE 5: Production Deployment

### [ ] Deploy Convex to production
**Reference:** `/docs/PRODUCTION-HANDOFF.md` deployment steps
**Acceptance criteria:**
- Run `npx convex deploy --prod`
- Production URL obtained
- Schema deployed successfully
- Functions accessible

### [ ] Deploy to Vercel production
**Reference:** Vercel deployment guide
**Acceptance criteria:**
- Push to main branch or run `vercel --prod`
- Build completes without errors
- All pages load correctly
- Environment variables working

### [ ] Configure Stripe webhooks
**Reference:** Stripe Dashboard > Webhooks
**Acceptance criteria:**
- Add endpoint: https://[domain]/api/webhooks/stripe
- Select events: checkout.session.completed
- Copy webhook signing secret
- Add secret to Vercel env vars
- Test webhook with Stripe CLI

### [ ] Verify email sending
**Reference:** Resend dashboard
**Acceptance criteria:**
- Send test email from production
- Verify domain authentication
- Check email deliverability
- Confirm templates render correctly

---

## PHASE 6: Production Testing

### [ ] Test complete user registration flow
**Reference:** `/docs/flow-pages.md` user flows
**Acceptance criteria:**
- New user can sign up
- Email verification works
- User lands on correct page
- Role defaults to "traveler"

### [ ] Test host application flow
**Reference:** `/docs/flow-pages.md` host application
**Acceptance criteria:**
- Traveler can apply to be host
- Application saves to database
- Admin receives notification
- Admin can approve/reject

### [ ] Test experience creation (as admin-turned-host)
**Reference:** `/docs/flow-pages.md` host features
**Acceptance criteria:**
- Create test experience as admin
- Image uploads successfully
- Translation works (ES/EN)
- Experience appears in listings

### [ ] Test complete booking flow
**Reference:** `/docs/flow-pages.md` booking flow
**Acceptance criteria:**
- Search and find experience
- Select date and guests
- Proceed to Stripe checkout
- Use test card in production mode
- Booking confirmation received
- Email notifications sent

### [ ] Test both language versions
**Reference:** `/docs/masterplan.md` i18n requirements
**Acceptance criteria:**
- Switch between EN and ES
- All pages translated
- No missing translations
- Language preference persists

### [ ] Test mobile responsiveness
**Reference:** `/docs/design-guidelines.md` responsive design
**Acceptance criteria:**
- Test on actual mobile devices
- All features accessible
- Forms usable on small screens
- Images load appropriately

### [ ] Verify admin dashboard
**Reference:** `/docs/flow-pages.md` admin features
**Acceptance criteria:**
- Admin can log in
- Metrics display correctly
- Host applications visible
- All admin functions work

---

## PHASE 7: Security & Performance

### [ ] Security audit
**Reference:** `/docs/PRODUCTION-HANDOFF.md` security checklist
**Acceptance criteria:**
- All API keys in env variables only
- No exposed secrets in code
- Role-based access working
- Webhook signature verified
- HTTPS enforced

### [ ] Performance testing
**Reference:** Lighthouse metrics
**Acceptance criteria:**
- Run Lighthouse audit
- Performance score > 90
- Accessibility score > 95
- SEO score > 90
- Address any critical issues

### [ ] Configure monitoring
**Reference:** `/docs/PRODUCTION-HANDOFF.md` monitoring
**Acceptance criteria:**
- Vercel Analytics enabled
- Error tracking considered
- Uptime monitoring setup
- Performance monitoring active

---

## PHASE 8: Documentation & Training

### [ ] Create admin user guide
**Reference:** Admin functionality
**Acceptance criteria:**
- How to approve/reject hosts
- How to view platform metrics
- How to manage experiences
- Troubleshooting common issues

### [ ] Create host quick-start guide
**Reference:** Host features
**Acceptance criteria:**
- How to apply as host
- Creating first experience
- Managing availability
- Handling bookings

### [ ] Update credentials document
**Reference:** All service accounts
**Acceptance criteria:**
- List all services and logins
- Document which accounts client owns
- Note Microsoft Translator is developer-managed
- Include support contacts

### [ ] Record platform walkthrough video
**Reference:** Loom or similar
**Acceptance criteria:**
- Complete user journey demo
- Admin dashboard walkthrough
- Host features explanation
- Common tasks demonstrated

---

## PHASE 9: Client Handoff

### [ ] Transfer admin credentials
**Reference:** Production admin account
**Acceptance criteria:**
- Provide admin email/password
- Client successfully logs in
- Client changes password
- Client has full admin access

### [ ] Transfer service account access
**Reference:** All created accounts
**Acceptance criteria:**
- Clerk account ownership transferred
- Convex account ownership transferred
- Resend account ownership transferred
- Vercel account ownership transferred
- Stripe webhooks verified

### [ ] Provide documentation package
**Reference:** All documentation created
**Acceptance criteria:**
- Production handoff document delivered
- Admin guide delivered
- Host guide delivered
- Video walkthrough links shared
- Emergency contact info provided

### [ ] Conduct handoff meeting
**Reference:** Client requirements
**Acceptance criteria:**
- Walk through admin dashboard
- Demonstrate key features
- Review documentation
- Answer questions
- Confirm client comfort level

### [ ] Establish support agreement
**Reference:** Post-launch support
**Acceptance criteria:**
- Define support channels
- Set response time expectations
- Clarify what's included
- Document any ongoing costs
- Note: Don't mention Microsoft Translator management

---

## PHASE 10: Post-Deployment Verification

### [ ] Monitor first 24 hours
**Reference:** Production stability
**Acceptance criteria:**
- No critical errors in logs
- All services operational
- Performance metrics stable
- No security alerts

### [ ] Verify client can operate independently
**Reference:** Client capability
**Acceptance criteria:**
- Client can approve hosts
- Client can view metrics
- Client understands basic operations
- Client knows how to get help

### [ ] Create backup of clean production state
**Reference:** Disaster recovery
**Acceptance criteria:**
- Document initial production state
- Note configuration settings
- Export schema if needed
- Document recovery process

### [ ] Close out development resources
**Reference:** Development cleanup
**Acceptance criteria:**
- Development database archived
- Test accounts documented
- Development keys rotated
- Project marked as complete

---

## Final Checklist

### Technical Handoff
- [ ] All test data removed
- [ ] Production deployed successfully
- [ ] Custom domain working
- [ ] SSL certificate active
- [ ] All integrations tested
- [ ] Performance optimized
- [ ] Security verified
- [ ] Monitoring active

### Client Readiness
- [ ] Admin access working
- [ ] Documentation delivered
- [ ] Training completed
- [ ] Support agreement clear
- [ ] Client can manage platform
- [ ] Emergency contacts provided

### Service Accounts
- [ ] Clerk (client owns)
- [ ] Convex (client owns)
- [ ] Resend (client owns)
- [ ] Vercel (client owns)
- [ ] Stripe (client owns)
- [ ] Microsoft Translator (developer manages, not disclosed)

---

## Notes

- **Critical:** Remove ALL test data before production deployment
- **Important:** Keep only the admin account from development
- **Remember:** Microsoft Translator is managed by developer (not mentioned to client)
- **Domain:** Client already owns domain, just needs DNS configuration
- **Stripe:** Client already has Stripe account, just needs to provide API keys
- **Timeline:** Complete all phases sequentially for smooth deployment

---

**Last Updated:** August 6 2025  
**Status:** Ready to Execute  
**Estimated Time:** 2-3 days for complete deployment and handoff