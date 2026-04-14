# Session 18 — Registration Payment Flow

## Dependencies
Sessions 11 (registrations), 17 (Stripe foundation)

## Branch
`session/18-registration-payments`

## Goal
Wire up Stripe payments to the registration flow. Pre-registration can be paid online (using preRegistrationStripePriceId or stripePriceId), and events can optionally require payment. Supports cross-selling via stripeCrossProductIds displayed at checkout.

## Tasks
- Modify `POST /api/events/:eventId/registrations` (pre-register) to:
  - If event has a preRegistrationStripePriceId (or stripePriceId), create a Stripe Checkout session
  - Include stripeCrossProductIds as optional additional line items
  - If event.preRegistrationUnpaid is true, allow registration without payment
  - Return checkoutUrl along with registration data
  - Registration is created in "pending payment" state until webhook confirms
- Add checkout session metadata: `{ type: 'registration', registrationId, eventId }`
- Handle `checkout.session.completed` webhook for registration payments:
  - Look up registration by metadata
  - Set stripePaymentId on the registration
  - Mark as paid
- Modify `POST /api/events/:eventId/registrations/gate` to:
  - Support marking as "cash" payment (no Stripe — stripePaymentId stays null)
  - Optionally create a Stripe checkout for gate registrations too
- Add payment status to registration responses:
  - `paymentStatus`: 'paid' | 'pending' | 'unpaid' | 'cash'
- Create:
  - `GET /api/registrations/:id/payment` — get payment details (amount, date, receipt URL from Stripe)
  - `POST /api/registrations/:id/refund` — issue refund (club member only)

## Files to Create/Modify
Modify:
- `apps/api/src/routes/registrations.ts`
- `apps/api/src/routes/stripe-webhooks.ts`
- `packages/shared/src/schemas/registration.ts`

## Acceptance Criteria
- Pre-registration with payment returns a Stripe checkout URL
- Webhook correctly updates registration with payment ID
- Cross-sell products appear in checkout
- preRegistrationUnpaid allows registration without payment
- Gate registration supports cash marking
- Payment status accurately reflected in API responses
- Refund works through Stripe API
