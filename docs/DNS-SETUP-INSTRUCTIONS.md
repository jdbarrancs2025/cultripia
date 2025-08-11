# DNS Configuration Instructions for Cultripia.com

## Overview
These instructions will guide you through adding the required DNS records in GoDaddy for your Cultripia application. These records are necessary for user authentication and email services to work properly with your custom domain.

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

### Step 3: Add the Required CNAME Records

You will need to add 5 CNAME records. For each record below:

1. Click **"Add"** or **"Add Record"** button
2. Select **"CNAME"** as the Type
3. Fill in the fields as shown below
4. Click **"Save"** after each record

#### Record 1: Frontend API
- **Type:** CNAME
- **Name:** `clerk`
- **Value:** `frontend-api.clerk.services`
- **TTL:** 600 seconds (or leave as default)

#### Record 2: Account Portal
- **Type:** CNAME
- **Name:** `accounts`
- **Value:** `accounts.clerk.services`
- **TTL:** 600 seconds (or leave as default)

#### Record 3: Email Service
- **Type:** CNAME
- **Name:** `clkmail`
- **Value:** `mail.jus10w3hvkgs.clerk.services`
- **TTL:** 600 seconds (or leave as default)

#### Record 4: Email Authentication (DKIM 1)
- **Type:** CNAME
- **Name:** `clk._domainkey`
- **Value:** `dkim1.jus10w3hvkgs.clerk.services`
- **TTL:** 600 seconds (or leave as default)

#### Record 5: Email Authentication (DKIM 2)
- **Type:** CNAME
- **Name:** `clk2._domainkey`
- **Value:** `dkim2.jus10w3hvkgs.clerk.services`
- **TTL:** 600 seconds (or leave as default)

### Step 4: Save All Changes

1. After adding all 5 records, make sure to click **"Save"** or **"Save All Records"**
2. You should see a confirmation message that your DNS records have been updated

### Step 5: Wait for DNS Propagation

- DNS changes typically take **5-30 minutes** to propagate
- In some cases, it may take up to 48 hours (though this is rare)
- You can check the status at: https://dnschecker.org

### Step 6: Verify Configuration

Once you've added all the records and waited for propagation:

1. Let your developer know the DNS records have been added
2. They will verify the configuration in the Clerk dashboard
3. Once verified, your authentication system will be fully operational

---

## Important Notes

⚠️ **DO NOT DELETE** any existing DNS records unless specifically instructed  
⚠️ **COPY EXACTLY** - The values must be copied exactly as shown, including all dots and dashes  
⚠️ **SUBDOMAINS** - These records create subdomains (clerk.cultripia.com, accounts.cultripia.com, etc.) that handle authentication

---

## Troubleshooting

If you encounter any issues:

1. **"Record already exists" error:** Check if the record name is already in use and contact your developer
2. **Can't find DNS management:** Look for "Domain Settings" or "Manage Zones" as alternatives
3. **Different interface:** GoDaddy occasionally updates their interface. Look for similar options or use their help chat

---

## Need Help?

If you have any questions or run into issues:
1. Take a screenshot of the error or current screen
2. Send it to your developer
3. GoDaddy Support can also help: 1-480-505-8877

---

**Document Created:** August 7, 2025  
**For Domain:** cultripia.com  
**Purpose:** Clerk Authentication System Setup