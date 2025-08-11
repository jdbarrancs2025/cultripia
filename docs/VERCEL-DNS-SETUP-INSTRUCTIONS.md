# Vercel Domain Configuration Instructions for Cultripia.com

## Overview
These instructions will guide you through adding the required DNS records in GoDaddy to connect your domain (cultripia.com) to Vercel hosting. This will make your website accessible at cultripia.com and www.cultripia.com.

**Time Required:** 10-15 minutes  
**Difficulty:** Easy (copy and paste)

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

### Step 3: Add the Required DNS Records for Vercel

You will need to add 2 DNS records for Vercel hosting:

#### Record 1: Root Domain (cultripia.com)
1. Click **"Add"** or **"Add Record"** button
2. Select **"A"** as the Type
3. Fill in the fields:
   - **Type:** A
   - **Name:** `@` (this represents the root domain)
   - **Value:** `216.198.79.1`
   - **TTL:** 600 seconds (or leave as default)
4. Click **"Save"**

#### Record 2: WWW Subdomain (www.cultripia.com)
1. Click **"Add"** or **"Add Record"** button again
2. Select **"CNAME"** as the Type
3. Fill in the fields:
   - **Type:** CNAME
   - **Name:** `www`
   - **Value:** `bc8cca522ae6ca98.vercel-dns-017.com`
   - **TTL:** 600 seconds (or leave as default)
4. Click **"Save"**

### Step 4: Remove Conflicting Records (If Any)

⚠️ **IMPORTANT:** If you see any existing records with the same names, you may need to update or remove them:

1. Look for any existing **A records** with Name `@` 
   - If found, either UPDATE it to point to `216.198.79.1` or DELETE it first
2. Look for any existing **CNAME records** with Name `www`
   - If found, either UPDATE it to point to `bc8cca522ae6ca98.vercel-dns-017.com` or DELETE it first

### Step 5: Save All Changes

1. After adding both records, make sure to click **"Save"** or **"Save All Records"**
2. You should see a confirmation message that your DNS records have been updated

### Step 6: Wait for DNS Propagation

- DNS changes typically take **5-30 minutes** to propagate
- In some cases, it may take up to 48 hours (though this is rare)
- You can check the propagation status at: https://dnschecker.org
- Enter "cultripia.com" to see if the new records are active worldwide

### Step 7: Verify Configuration in Vercel

Once you've added the records and waited for propagation:

1. Let your developer know the DNS records have been added
2. They will click "Refresh" in the Vercel dashboard to verify
3. Once verified, your website will be accessible at:
   - https://cultripia.com
   - https://www.cultripia.com

---

## Summary of Records to Add

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | @ | 216.198.79.1 | Points cultripia.com to Vercel |
| CNAME | www | bc8cca522ae6ca98.vercel-dns-017.com | Points www.cultripia.com to Vercel |

---

## Important Notes

⚠️ **EXACT VALUES:** Copy the values exactly as shown above  
⚠️ **BOTH RECORDS NEEDED:** You must add both records for the domain to work properly  
⚠️ **SSL CERTIFICATE:** Vercel will automatically provide a free SSL certificate once the domain is verified  
⚠️ **EXISTING RECORDS:** If you have existing A or CNAME records for @ or www, they need to be updated or replaced

---

## Troubleshooting

### Common Issues:

1. **"Record already exists" error:** 
   - Look for existing A record with name "@" and update or delete it
   - Look for existing CNAME record with name "www" and update or delete it

2. **Domain still shows "Invalid Configuration" after 30 minutes:**
   - Double-check that you copied the values exactly
   - Ensure there are no typos in the record values
   - Check that you saved the changes in GoDaddy

3. **Can't find where to add records:**
   - Look for "DNS Management" or "Manage Zones"
   - Use GoDaddy's help chat for navigation assistance

---

## Combined DNS Records

After completing both this guide and the Clerk DNS setup, you should have these records in GoDaddy:

### Vercel Records (This Guide):
- A record: @ → 216.198.79.1
- CNAME: www → bc8cca522ae6ca98.vercel-dns-017.com

### Clerk Records (Previous Guide):
- CNAME: clerk → frontend-api.clerk.services
- CNAME: accounts → accounts.clerk.services
- CNAME: clkmail → mail.jus10w3hvkgs.clerk.services
- CNAME: clk._domainkey → dkim1.jus10w3hvkgs.clerk.services
- CNAME: clk2._domainkey → dkim2.jus10w3hvkgs.clerk.services

---

## Need Help?

If you have any questions or run into issues:
1. Take a screenshot of your current DNS records in GoDaddy
2. Send it to your developer
3. GoDaddy Support can also help: 1-480-505-8877

---

**Document Created:** August 7, 2025  
**For Domain:** cultripia.com  
**Purpose:** Vercel Hosting Setup  
**Required Records:** 2 (one A record, one CNAME record)