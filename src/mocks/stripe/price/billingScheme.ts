import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities/random'

export const randomPriceBillingScheme: MockFunction<Stripe.Price.BillingScheme, [Stripe.Price.BillingScheme?]> = (override) => {
  const options: Stripe.Price.BillingScheme[] = ['per_unit', 'tiered']

  return override ?? pick(options)
}