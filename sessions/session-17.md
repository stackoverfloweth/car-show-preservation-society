# Session 17 — Stripe Foundation

## Dependencies
Session 03 (backend skeleton)

## Branch
`session/17-stripe-foundation`

## Goal
Set up Stripe SDK, webhook handling, and core helper functions that other sessions will use for payments. This includes customer creation for users and clubs, checkout session creation, and payment status retrieval.

## Tasks
- Install `stripe` package in apps/api
- Create `apps/api/src/lib/stripe.ts`:
  - Initialize Stripe client with STRIPE_SECRET_KEY
  - `createCustomer(params: { email, name, metadata })` — creates Stripe customer, returns customerId
  - `createCheckoutSession(params)` — creates a Stripe Checkout session with line items, success/cancel URLs, customer
  - `retrievePaymentIntent(id)` — get payment details
  - `createRefund(paymentIntentId)` — issue refund
  - `listInvoices(customerId)` — retrieve invoices for a customer
- Create `apps/api/src/routes/stripe-webhooks.ts`:
  - `POST /api/webhooks/stripe` — verify webhook signature, handle events:
    - `checkout.session.completed` — generic handler that routes based on metadata
    - `payment_intent.payment_failed` — log failure
    - `customer.created` — optional logging
  - Webhook verification using stripe.webhooks.constructEvent
- Add Stripe customer creation to user and club flows:
  - Helper: `ensureStripeCustomer(userId)` — creates Stripe customer if user doesn't have stripeCustomerId, updates user record
  - Same for clubs: `ensureClubStripeCustomer(clubId)`
- Create API routes:
  - `GET /api/users/me/invoices` — list Stripe invoices for authenticated user
  - `GET /api/users/me/payments` — list recent payments

## Files to Create/Modify
Create:
- `apps/api/src/lib/stripe.ts`
- `apps/api/src/routes/stripe-webhooks.ts`

Modify:
- `apps/api/src/index.ts`
- `apps/api/package.json`

## Acceptance Criteria
- Stripe client initializes correctly
- Webhook endpoint verifies signatures
- Customer creation works
- Checkout session creation returns a valid URL
- Webhook handlers process events correctly
- Invoice/payment listing works
