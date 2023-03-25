import { Location } from '@/models/location'
import { MockFunction } from '@/services/mocker'
import { capitalize, pick } from '@/utilities'

export const randomLocation: MockFunction<Location, [Partial<Location>?]> = function(overrides) {
  const placeName = `${capitalize(this.create('adjective'))} ${capitalize(this.create('noun'))}`
  const houseNumber = this.create('number', [5, 9000])
  const direction = pick(['', 'N ', 'W ', 'S ', 'E '])
  const streetName = capitalize(this.create('noun'))
  const streetType = pick(['st', 'dr', 'ln', 'pkwy', 'blvd'])
  const city = capitalize(this.create('noun'))
  const state = pick(['WI', 'IL', 'MN', 'MI'])
  const zip = this.createMany('number', 5, [0, 9]).join('')

  return {
    place: `${placeName}
    ${houseNumber} ${direction}${streetName} ${streetType}
    ${city}, ${state} ${zip}`,
    coordinates: [44.899726, -89.72133],
    ...overrides,
  }
}