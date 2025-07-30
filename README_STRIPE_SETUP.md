# Stripe Setup Instructions for Cultripia

## Testing Stripe Integration Locally

### 1. Install Stripe CLI (if not already installed)
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from https://stripe.com/docs/stripe-cli
```

### 2. Login to Stripe CLI
```bash
stripe login
```

### 3. Forward webhooks to local server
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will display your webhook signing secret, which looks like:
`whsec_...`

### 4. Update your .env.local file
Replace the placeholder webhook secret with the one from step 3:
```
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

### 5. Test the payment flow
1. Go to an experience detail page
2. Select a date and number of guests
3. Click "Proceder al pago"
4. Use test card: 4242 4242 4242 4242
5. Any future expiry date and any CVC
6. Complete the payment

### 6. Verify webhook events
In the terminal running `stripe listen`, you should see:
- `checkout.session.completed` event when payment succeeds
- The booking should be marked as paid in the database

## Test Cards

- **Success**: 4242 4242 4242 4242
- **Requires authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 9995

## Production Setup

For production, you'll need to:
1. Get production API keys from Stripe Dashboard
2. Set up webhook endpoint in Stripe Dashboard
3. Get the webhook signing secret from Stripe Dashboard
4. Update environment variables with production values