# Resend Email Configuration Instructions for Cultripia.com

## Overview
These instructions will guide you through adding the required DNS records in GoDaddy to enable email sending through Resend. This will allow your Cultripia application to send transactional emails (confirmations, notifications, etc.) from your domain.

**Time Required:** 10-15 minutes  
**Difficulty:** Easy (copy and paste)  
**Purpose:** Enable email sending from noreply@cultripia.com

---

## Step-by-Step Instructions

### Step 1: Log into GoDaddy

1. Go to https://www.godaddy.com
2. Click **"Sign In"** at the top right
3. Enter your GoDaddy username and password
4. Click **"Sign In"**

### Step 2: Navigate to DNS Management

1. Once logged in, click **"My Products"** in the account menu
2. Scroll down to find your domain: **cultripia.com**
3. Click the **"DNS"** button next to your domain
   - Alternative: Click **"Manage"** then select **"DNS"** from the menu

### Step 3: Add Required Email Records (DKIM and SPF)

These records are **REQUIRED** for email authentication and delivery:

#### Record 1: MX Record (Mail Exchange)
1. Click **"Add"** or **"Add Record"** button
2. Select **"MX"** as the Type
3. Fill in the fields:
   - **Type:** MX
   - **Name:** `send`
   - **Priority:** `10`
   - **Value:** `feedback-smtp.us-east-1.amazonses.com`
   - **TTL:** 600 seconds (or leave as default/Auto)
4. Click **"Save"**

#### Record 2: SPF Record (Sender Policy Framework)
1. Click **"Add"** or **"Add Record"** button
2. Select **"TXT"** as the Type
3. Fill in the fields:
   - **Type:** TXT
   - **Name:** `send`
   - **Value:** `v=spf1 include:amazonses.com ~all`
   - **TTL:** 600 seconds (or leave as default/Auto)
4. Click **"Save"**

#### Record 3: DKIM Record (Domain Keys)
1. Click **"Add"** or **"Add Record"** button
2. Select **"TXT"** as the Type
3. Fill in the fields:
   - **Type:** TXT
   - **Name:** `resend._domainkey`
   - **Value:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDKrrcqbCqKCiMup6s8pLvuZr7JeudcMdlKw8/mK7hxOahkcnfqd6fGYnIOPkFExQqF4Lxy8GrwZFK8bQz8A9cTQwZmb0sJRdTCQRhV1/0YKNJpxpJLqzTzCXWEKzXRHDM6tz1+jVdQ1r7F7vv2V4NhnhVQJC+zJMveWWH6Et9FwIDAQAB`
   - **TTL:** 600 seconds (or leave as default/Auto)
4. Click **"Save"**

### Step 4: Add Recommended DMARC Record

This record is **RECOMMENDED** for better email security and deliverability:

#### Record 4: DMARC Record (Email Authentication Policy)
1. Click **"Add"** or **"Add Record"** button
2. Select **"TXT"** as the Type
3. Fill in the fields:
   - **Type:** TXT
   - **Name:** `_dmarc`
   - **Value:** `v=DMARC1; p=none;`
   - **TTL:** 600 seconds (or leave as default/Auto)
4. Click **"Save"**

### Step 5: Save All Changes

1. After adding all 4 records, make sure to click **"Save"** or **"Save All Records"**
2. You should see a confirmation message that your DNS records have been updated

### Step 6: Wait for DNS Propagation

- DNS changes typically take **5-30 minutes** to propagate
- Email-related records may take up to **48 hours** to fully propagate
- You can check the propagation status at: https://dnschecker.org

### Step 7: Verify Configuration in Resend

Once you've added the records and waited for propagation:

1. Let your developer know the DNS records have been added
2. They will verify the configuration in the Resend dashboard
3. Once verified, your application can send emails from:
   - noreply@cultripia.com
   - Or any other @cultripia.com address configured

---

## Summary of Records to Add

| Type | Name | Priority | Value | Purpose |
|------|------|----------|-------|---------|
| MX | send | 10 | feedback-smtp.us-east-1.amazonses.com | Mail exchange server |
| TXT | send | - | v=spf1 include:amazonses.com ~all | SPF authentication |
| TXT | resend._domainkey | - | p=MIGfMA0GCS... (full key above) | DKIM signing |
| TXT | _dmarc | - | v=DMARC1; p=none; | DMARC policy (recommended) |

---

## Important Notes

⚠️ **COPY EXACTLY:** The DKIM key (Record 3) is very long - make sure to copy the ENTIRE value  
⚠️ **NO SPACES:** Ensure there are no extra spaces before or after the values  
⚠️ **ALL RECORDS NEEDED:** Add all 4 records for proper email functionality  
⚠️ **EMAIL DELIVERY:** These records ensure your emails don't end up in spam folders

---

## What These Records Do

- **MX Record:** Directs email traffic for the subdomain
- **SPF Record:** Tells receiving servers that Amazon SES is authorized to send emails for your domain
- **DKIM Record:** Provides a digital signature to verify emails are legitimate
- **DMARC Record:** Sets policy for how to handle emails that fail authentication

---

## Troubleshooting

### Common Issues:

1. **"Record already exists" error for TXT records:**
   - You can have multiple TXT records with the same name
   - Just add the new one alongside existing ones

2. **DKIM value seems cut off:**
   - The DKIM key is very long (starts with `p=MIGfMA...` and ends with `...Et9FwIDAQAB`)
   - Make sure you copy the ENTIRE value from this document

3. **Emails still not sending after 48 hours:**
   - Double-check all values are copied exactly
   - Verify no typos or extra spaces
   - Contact your developer to check Resend dashboard status

---

## Complete DNS Record List

After completing all three DNS setup guides, your GoDaddy DNS should have:

### Vercel Records (Hosting):
- A record: @ → 216.198.79.1
- CNAME: www → bc8cca522ae6ca98.vercel-dns-017.com

### Clerk Records (Authentication):
- CNAME: clerk → frontend-api.clerk.services
- CNAME: accounts → accounts.clerk.services
- CNAME: clkmail → mail.jus10w3hvkgs.clerk.services
- CNAME: clk._domainkey → dkim1.jus10w3hvkgs.clerk.services
- CNAME: clk2._domainkey → dkim2.jus10w3hvkgs.clerk.services

### Resend Records (Email):
- MX: send → feedback-smtp.us-east-1.amazonses.com (Priority: 10)
- TXT: send → v=spf1 include:amazonses.com ~all
- TXT: resend._domainkey → [DKIM key]
- TXT: _dmarc → v=DMARC1; p=none;

---

## Need Help?

If you have any questions or run into issues:
1. Take a screenshot of your current DNS records in GoDaddy
2. Send it to your developer
3. GoDaddy Support can also help: 1-480-505-8877

---

**Document Created:** August 7, 2025  
**For Domain:** cultripia.com  
**Purpose:** Resend Email Service Setup  
**Required Records:** 3 (MX, SPF, DKIM)  
**Recommended Records:** 1 (DMARC)