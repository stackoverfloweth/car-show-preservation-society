import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities/random'

export const randomProductType: MockFunction<Stripe.Product.Type, [Stripe.Product.Type?]> = (override) => {
  const options: Stripe.Product.Type[] = ['good', 'service']

  return override ?? pick(options)
}