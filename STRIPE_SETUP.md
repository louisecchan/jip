# Stripe Integration Setup

This project has been configured to import products from Stripe and handle payments through Stripe Checkout.

## Setup Instructions

### 1. Create a Stripe Account

- Go to [stripe.com](https://stripe.com) and create an account
- Complete the account setup and verification process

### 2. Get Your API Keys

- Log into your Stripe Dashboard
- Go to Developers > API Keys
- Copy your **Publishable key** (starts with `pk_test_` for test mode)
- Copy your **Secret key** (starts with `sk_test_` for test mode)

### 3. Configure Environment Variables

- Copy `.env.example` to `.env` in your project root
- Add your Stripe keys to the `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 4. Create Products in Stripe

- Go to your Stripe Dashboard > Products
- Create products with the following structure:
  - **Name**: Product name
  - **Description**: Product description
  - **Images**: Upload product images
  - **Pricing**: Set the price (in cents)
  - **Metadata**: Add a `category` field for filtering

### 5. Test the Integration

- Run your development server: `npm run dev`
- Visit `/products` to see your Stripe products
- Test the checkout flow (use Stripe test card numbers)

## Features

- **Product Import**: Automatically fetches products from your Stripe account
- **Category Filtering**: Products are filtered by the `category` metadata field
- **Stripe Checkout**: Secure payment processing through Stripe Checkout
- **Success Page**: Custom success page after successful payment
- **Error Handling**: Graceful error handling for API failures

## Test Card Numbers

For testing payments, use these Stripe test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## Production Deployment

Before going live:

1. Switch to live mode in Stripe Dashboard
2. Update your environment variables with live keys
3. Test thoroughly with real payment methods
4. Set up webhooks for order fulfillment (optional)

## Troubleshooting

- **No products showing**: Check that your Stripe secret key is correct and products are marked as "Active"
- **Checkout not working**: Verify your API keys and ensure the checkout session endpoint is accessible
- **Images not loading**: Make sure product images are uploaded to Stripe and publicly accessible
