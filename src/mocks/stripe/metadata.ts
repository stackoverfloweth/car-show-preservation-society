import type Stripe from 'stripe'
import { MockFunction } from '@/services/mocker'

export const randomMetadata: MockFunction<Stripe.Metadata, [Stripe.Metadata?]> = function(overrides = {}) {
  for (let index = 0; index < this.create('number'); index++) {
    overrides[this.create('noun')] = this.create('string')
  }

  return overrides
}