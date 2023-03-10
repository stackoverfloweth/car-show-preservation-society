import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'

export const randomPriceRecurring: MockFunction<Stripe.Price.Recurring, [Partial<Stripe.Price.Recurring>?]> = function(overrides = {}) {
  return {
    'aggregate_usage': this.create('boolean') ? this.create('stripe.price.aggregateUsage') : null,
    'interval': this.create('stripe.price.interval'),
    'interval_count': this.create('number'),
    'trial_period_days': this.create('boolean') ? this.create('number') : null,
    'usage_type': this.create('stripe.price.usageType'),
    ...overrides,
  }
}