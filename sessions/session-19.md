# Session 19 — Voting Category Premium Registration

## Dependencies
Sessions 10 (voting categories), 17 (Stripe)

## Branch
`session/19-category-payments`

## Goal
Support extra charges for registering in certain voting categories. If a votingCategory has a stripePriceId, the driver pays an additional fee when selecting that category.

## Tasks
- Modify voting category registration endpoint (`POST /api/voting-categories/:id/registrations`):
  - If the voting category has a stripePriceId, create a Stripe checkout session for the additional fee
  - Add metadata: `{ type: 'category_registration', votingCategoryId, registrationId }`
  - Return checkoutUrl
  - Category registration is "pending" until payment confirmed
- Add `paymentStatus` column to votingCategoryRegistrations table (text: 'paid' | 'pending' | 'free')
- Handle `checkout.session.completed` webhook for category payments:
  - Look up by metadata
  - Mark votingCategoryRegistration as paid
- If category has no stripePriceId, registration is immediate (status = 'free')
- Optionally bundle category fees into the main registration checkout:
  - If a driver selects categories during pre-registration, add those prices as line items to the main checkout session

## Files to Create/Modify
Modify:
- `apps/api/src/routes/voting-categories.ts`
- `apps/api/src/routes/stripe-webhooks.ts`
- `packages/db/src/schema/voting-category-registrations.ts`

## Acceptance Criteria
- Categories with stripePriceId require payment to register
- Categories without stripePriceId register immediately
- Webhook updates payment status
- Can bundle category fees with main registration checkout
