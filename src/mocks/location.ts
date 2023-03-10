import { Location } from '@/models/location'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities'

export const randomLocation: MockFunction<Location, []> = function() {
  return {
    city: this.create('noun'),
    state: pick(['WI', 'IL', 'MN', 'MI']),
  }
}