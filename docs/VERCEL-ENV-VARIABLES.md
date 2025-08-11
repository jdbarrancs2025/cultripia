# Vercel Environment Variables for Production

## Instructions
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add each variable below with:
- Environment: **Production** (uncheck Preview and Development)
- Add as **Encrypted** for sensitive keys

---

## Variables to Add

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuY3VsdHJpcGlhLmNvbSQ
CLERK_SECRET_KEY=sk_live_WwxAbMD1iflvPTFwxbQWSnqg8Oi32ptYGPHWLFkTTL
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Convex Database
```
CONVEX_DEPLOYMENT=prod:agile-raccoon-463
NEXT_PUBLIC_CONVEX_URL=https://agile-raccoon-463.convex.cloud
```

### Stripe Payments (NEED FROM CLIENT)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[Client needs to provide pk_live_...]
STRIPE_SECRET_KEY=[Client needs to provide sk_live_...]
STRIPE_WEBHOOK_SECRET=[Will be generated after webhook setup]
```

### Application URL
```
NEXT_PUBLIC_APP_URL=https://cultripia.com
```

---

## Checklist

### Already Configured
- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- [ ] CLERK_SECRET_KEY  
- [ ] NEXT_PUBLIC_CLERK_SIGN_IN_URL
- [ ] NEXT_PUBLIC_CLERK_SIGN_UP_URL
- [ ] NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
- [ ] NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
- [ ] CONVEX_DEPLOYMENT
- [ ] NEXT_PUBLIC_CONVEX_URL
- [ ] NEXT_PUBLIC_APP_URL

### Pending (Need from Client)
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (production key from client's Stripe)
- [ ] STRIPE_SECRET_KEY (production key from client's Stripe)
- [ ] STRIPE_WEBHOOK_SECRET (will be generated after webhook configuration)

---

## Important Notes

1. **Environment Scope**: Make sure to set these ONLY for **Production** environment
2. **Encryption**: Mark sensitive keys (CLERK_SECRET_KEY, STRIPE_SECRET_KEY) as encrypted
3. **No Quotes**: Do not include quotes around the values when pasting
4. **Stripe Keys**: Client needs to provide their live Stripe API keys
5. **Webhook Secret**: Will be configured after deployment when setting up Stripe webhooks

---

## After Adding Variables

1. Trigger a new deployment to apply the environment variables
2. Verify the deployment succeeds
3. Test the production site functionality

---

**Last Updated:** August 2025
**Domain:** cultripia.com
**Production URL:** https://cultripia.com