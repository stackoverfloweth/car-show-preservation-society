import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities/random'

export const randomPriceRecurringUsageType: MockFunction<Stripe.Price.Recurring.UsageType, [Stripe.Price.Recurring.UsageType?]> = function(override) {
  const options: Stripe.Price.Recurring.UsageType[] = ['licensed', 'metered']

  return override ?? pick(options)
}