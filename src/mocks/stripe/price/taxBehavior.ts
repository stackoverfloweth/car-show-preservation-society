import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities/random'

export const randomPriceTaxBehavior: MockFunction<Stripe.Price.TaxBehavior, [Stripe.Price.TaxBehavior?]> = function(override) {
  const options: Stripe.Price.TaxBehavior[] = ['exclusive', 'inclusive', 'unspecified']

  return override ?? pick(options)
}