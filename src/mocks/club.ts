import { Club } from '@/models/club'
import { MockFunction } from '@/services/mocker'

export const randomClub: MockFunction<Club, [Partial<Club>?]> = function(overrides) {
  return {
    clubId: this.create('id'),
    name: this.create('noun'),
    description: this.create('sentence'),
    stripeCustomerId: undefined,
    clubLogo: this.create('image'),
    ...overrides,
  }
}