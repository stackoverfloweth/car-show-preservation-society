import { Vehicle } from '@/models/vehicle'
import { MockFunction } from '@/services/mocker'
import { capitalize, pick } from '@/utilities'

export const randomVehicle: MockFunction<Vehicle, [Partial<Vehicle>?]> = function(overrides) {
  return {
    vehicleId: this.create('id'),
    userId: this.create('id'),
    make: capitalize(this.create('adjective')),
    model: capitalize(this.create('noun')),
    year: this.create('number', [1900, 2020]).toString(),
    description: this.create('sentence'),
    color: pick(['red', 'green', 'blue', 'white', 'orange', 'black', 'fuchsia']),
    modificationCount: this.create('number', [0, 4]),
    modifiedAppearance: this.create('boolean'),
    image: this.create('boolean') ? this.create('image') : undefined,
    ...overrides,
  }
}