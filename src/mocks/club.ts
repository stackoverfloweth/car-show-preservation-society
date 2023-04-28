import { Club } from '@/models/club'
import { MockFunction } from '@/services/mocker'
import { capitalize } from '@/utilities'

export const randomClub: MockFunction<Club, [Partial<Club>?]> = function(overrides) {
  return new Club({
    _id: this.create('id'),
    name: `The ${capitalize(this.create('noun'))} Club`,
    description: this.create('paragraph'),
    stripeCustomerId: undefined,
    image: this.create('image'),
    contactUserId: this.create('id').toString(),
    joinableByApplication: true,
    ...overrides,
  })
}