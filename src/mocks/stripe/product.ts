import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'

export const randomProduct: MockFunction<Stripe.Product, [Partial<Stripe.Product>?]> = function(overrides = {}) {
  return {
    'id': this.create('string'),
    'object': 'product',
    'active': this.create('boolean'),
    'attributes': this.createMany('string', 5),
    'caption': null,
    'created': this.create('date').getTime(),
    'deactivate_on': [],
    'default_price': this.create('string'),
    'deleted': undefined,
    'description': this.create('boolean') ? this.create('string') : null,
    'images': this.createMany('string', this.create('number', [0, 5])),
    'livemode': this.create('boolean'),
    'metadata': this.create('stripe.metadata'),
    'name': this.create('noun'),
    'package_dimensions': null,
    'shippable': this.create('boolean') ? this.create('boolean') : null,
    'statement_descriptor': this.create('boolean') ? this.create('string') : null,
    'tax_code': this.create('boolean') ? this.create('string') : null,
    'type': this.create('stripe.product.type'),
    'unit_label': this.create('boolean') ? this.create('string') : null,
    'updated': this.create('date').getTime(),
    'url': this.create('boolean') ? this.create('url') : null,
    ...overrides,
  }
}