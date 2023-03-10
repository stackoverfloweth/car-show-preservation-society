import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities/random'

export const randomPriceType: MockFunction<Stripe.Price.Type, [Stripe.Price.Type?]> = (override) => {
  const options: Stripe.Price.Type[] = ['one_time', 'recurring']

  return override ?? pick(options)
}