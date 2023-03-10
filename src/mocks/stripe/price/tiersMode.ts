import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities/random'

export const randomPriceTiersMode: MockFunction<Stripe.Price.TiersMode, [Stripe.Price.TiersMode?]> = function(override) {
  const options: Stripe.Price.TiersMode[] = ['graduated', 'volume']

  return override ?? pick(options)
}