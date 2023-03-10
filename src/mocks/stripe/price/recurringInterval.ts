import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities/random'

export const randomPriceRecurringInterval: MockFunction<Stripe.Price.Recurring.Interval, [Stripe.Price.Recurring.Interval?]> = function(override) {
  const options: Stripe.Price.Recurring.Interval[] = ['day', 'month', 'week', 'year']

  return override ?? pick(options)
}