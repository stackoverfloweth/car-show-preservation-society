import { Vehicle } from '@/models/vehicle'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities'

export const randomVehicle: MockFunction<Vehicle, []> = function() {
  return {
    vehicleId: this.create('id'),
    userId: this.create('id'),
    make: this.create('adjective'),
    model: this.create('noun'),
    year: this.create('number', [1900, 2020]).toString(),
    description: this.create('sentence'),
    color: pick(['red', 'green', 'blue', 'white', 'orange', 'black', 'fuchsia']),
    modificationCount: this.create('number', [0, 4]),
    modifiedAppearance: this.create('boolean'),
  }
}