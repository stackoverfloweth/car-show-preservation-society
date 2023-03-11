import { Location } from '@/models/location'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities'

export const randomLocation: MockFunction<Location, [Partial<Location>?]> = function(overrides) {
  return {
    city: this.create('noun'),
    state: pick(['WI', 'IL', 'MN', 'MI']),
    ...overrides,
  }
}