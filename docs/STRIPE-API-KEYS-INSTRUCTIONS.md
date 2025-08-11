# How to Find Your Stripe API Keys for Cultripia

## Overview
This guide will help you locate your Stripe API keys needed to complete the Cultripia payment integration. You'll need to find two keys from your Stripe account.

**Time Required:** 5 minutes  
**What You Need:** Access to your Stripe account

---

## Step-by-Step Instructions

### Step 1: Log into Your Stripe Account

1. Go to https://stripe.com
2. Click **"Sign in"** at the top right
3. Enter your email and password
4. Click **"Sign in"**

### Step 2: Switch to Live Mode

⚠️ **IMPORTANT:** Make sure you're in **LIVE mode**, not TEST mode

1. Look at the top left of your Stripe dashboard
2. You'll see a toggle switch that says either "Test" or "Live"
3. If it shows **"Test"**, click on it and switch to **"Live"**
4. The toggle should now show **"Live"** and be highlighted

![Live Mode Example]
- The toggle should show: **[Live ✓]** not [Test]

### Step 3: Navigate to API Keys

1. In the Stripe dashboard, click on **"Developers"** in the top menu
2. From the dropdown menu, select **"API keys"**
3. You should now see the "API keys" page

**Alternative navigation:**
- Direct link (after logging in): https://dashboard.stripe.com/apikeys

### Step 4: Locate Your Live API Keys

On the API keys page, you'll see two sections:

#### A. Publishable Key (Safe to Share)
- Look for **"Publishable key"** section
- You'll see a key that starts with: `pk_live_`
- Click the **"Reveal live key"** button if it's hidden
- **Copy this entire key**

Example format:
```
pk_live_51ABC123def456GHI789jkl...
```

#### B. Secret Key (Keep Private - Only Share with Developer)
- Look for **"Secret key"** section  
- You'll see a key that starts with: `sk_live_`
- Click the **"Reveal live key"** button
- You may need to enter your Stripe password again for security
- **Copy this entire key**

Example format:
```
sk_live_51ABC123def456GHI789jkl...
```

### Step 5: Send the Keys Securely

**Send both keys to your developer:**

```
Stripe Live API Keys for Cultripia:

Publishable Key:
[Paste your pk_live_ key here]

Secret Key:
[Paste your sk_live_ key here]
```

⚠️ **Security Tips:**
- Send these via a secure method (encrypted email, password manager, or secure message)
- Never post these keys publicly
- The secret key especially should be kept confidential
- After sending, delete the message from your sent folder

---

## Visual Checklist

Check that you have:
- [ ] Switched to **LIVE mode** (not Test mode)
- [ ] Found the **Publishable key** starting with `pk_live_`
- [ ] Found the **Secret key** starting with `sk_live_`
- [ ] Copied both complete keys (they're quite long)
- [ ] Ready to send them securely

---

## Common Issues

### "I only see test keys"
- Make sure you've switched to **Live mode** using the toggle at the top
- Test keys start with `pk_test_` or `sk_test_` - we need LIVE keys

### "I can't see the secret key"
- Click the **"Reveal live key"** button
- You may need to re-enter your Stripe password for security

### "I don't see the Developers menu"
- Make sure you're logged into the correct Stripe account
- You need to be an account owner or have admin permissions
- Try this direct link: https://dashboard.stripe.com/apikeys

### "The keys look cut off"
- Click the **copy** icon next to each key to copy the full value
- The keys are very long (over 100 characters) - make sure you get the entire key

---

## What These Keys Do

- **Publishable Key:** Allows the website to create secure payment forms (safe to use in public code)
- **Secret Key:** Allows the server to process payments and manage transactions (must be kept private)

Both are required for Cultripia to process payments through your Stripe account.

---

## Need Help?

If you have trouble finding the keys:
1. Take a screenshot of what you see (but don't include any visible keys)
2. Send it to your developer for guidance

---

## After Sending the Keys

Your developer will:
1. Add these keys to the Cultripia production environment
2. Configure the payment webhook
3. Test the payment system
4. Confirm everything is working

---

**Important Reminder:** These are your LIVE production keys that will process real payments. Make sure you're sending the Live keys (pk_live_ and sk_live_), not the Test keys (pk_test_ and sk_test_).

---

**Document Created:** August 2025  
**Purpose:** Retrieve Stripe API Keys for Cultripia Payment Integration  
**Security Level:** Secret Key is highly sensitive - handle with care