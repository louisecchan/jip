# Quick Setup Guide - Fix "Add to Cart" Issues

## The Problem

Your "Add to Cart" functionality is failing because Stripe is not properly configured.

## Quick Fix Steps

### 1. Create Environment File

Create a `.env` file in your project root with your Stripe keys:

```bash
# In your terminal, run:
touch .env
```

Then add this content to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 2. Get Your Stripe Keys

1. Go to [stripe.com](https://stripe.com) and create an account
2. Go to Dashboard > Developers > API Keys
3. Copy your **Secret key** (starts with `sk_test_`)
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Replace the placeholder values in your `.env` file

### 3. Create Products in Stripe

1. Go to Stripe Dashboard > Products
2. Click "Add product"
3. Fill in:
   - **Name**: Your product name
   - **Description**: Product description
   - **Images**: Upload product images
   - **Pricing**: Set price (in cents, e.g., 2999 for $29.99)
   - **Metadata**: Add `category` field (e.g., "candles")

### 4. Test the Fix

1. Restart your development server: `npm run dev`
2. Go to `/product` page
3. Click "Add to Cart" - it should now work!
4. Check browser console for detailed error messages if it still fails

## What I Fixed

- ✅ Added better error handling and logging
- ✅ Added validation for missing Stripe keys
- ✅ Improved debugging messages
- ✅ Added checks for invalid price IDs

## Still Having Issues?

Check the browser console (F12) for detailed error messages. The most common issues are:

- Missing or incorrect Stripe API keys
- No products created in Stripe
- Invalid price IDs
