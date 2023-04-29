import { Registration } from '@/models/registration'
import { MockFunction } from '@/services/mocker'

export const randomRegistration: MockFunction<Registration, [Partial<Registration>?]> = function(overrides) {
  const eventId = this.create('id')
  const isCheckedIn = this.create('boolean')

  return new Registration({
    registrationId: this.create('id'),
    registrationCode: this.create('string'),
    userId: this.create('id'),
    user: this.create('user'),
    eventId,
    registrationDate: this.create('date'),
    vehicleId: this.create('id'),
    vehicle: this.create('vehicle'),
    carId: isCheckedIn ? this.create('carId') : undefined,
    checkInDate: isCheckedIn ? this.create('date') : undefined,
    stripePaymentId: this.create('boolean') ? this.create('id') : undefined,
    votingCategoryIds: this.createMany('id', this.create('number', [1, 3])).map(id => id.toString()),
    ...overrides,
  })
}