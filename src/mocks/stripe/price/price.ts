import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'

export const randomPrice: MockFunction<Stripe.Price, [Partial<Stripe.Price>?]> = function(overrides = {}) {
  return {
    'id': this.create('string'),
    'object': 'price',
    'active': this.create('boolean'),
    'billing_scheme': this.create('stripe.price.billingScheme'),
    'created': this.create('date').getTime(),
    'currency': this.create('string'),
    'currency_options': { },
    'custom_unit_amount': null,
    'deleted': undefined,
    'livemode': this.create('boolean'),
    'lookup_key': this.create('boolean') ? this.create('string') : null,
    'metadata': this.create('stripe.metadata'),
    'nickname': this.create('boolean') ? this.create('string') : null,
    'product': this.create('stripe.product'),
    'recurring': this.create('boolean') ? this.create('stripe.price.recurring') : null,
    'tax_behavior': this.create('boolean') ? this.create('stripe.price.taxBehavior') : null,
    'tiers': [],
    'tiers_mode': this.create('boolean') ? this.create('stripe.price.tiersMode') : null,
    'transform_quantity': null,
    'type': this.create('stripe.price.type'),
    'unit_amount': this.create('boolean') ? this.create('number') : null,
    'unit_amount_decimal': this.create('boolean') ? this.create('string') : null,
    ...overrides,
  }
}