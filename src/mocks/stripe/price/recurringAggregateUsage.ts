import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities/random'

export const randomPriceRecurringAggregateUsage: MockFunction<Stripe.Price.Recurring.AggregateUsage, [Stripe.Price.Recurring.AggregateUsage?]> = function(override) {
  const options: Stripe.Price.Recurring.AggregateUsage[] = ['last_during_period', 'last_ever', 'max', 'sum']

  return override ?? pick(options)
}