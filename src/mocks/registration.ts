import { Registration } from '@/models/registration'
import { MockFunction } from '@/services/mocker'

export const randomRegistration: MockFunction<Registration, [Partial<Registration>?]> = function(overrides) {
  const eventId = this.create('id')

  return new Registration({
    registrationId: this.create('id'),
    registrationCode: this.create('string'),
    userId: this.create('id'),
    user: this.create('user'),
    eventId,
    registrationDate: this.create('date'),
    vehicleId: this.create('id'),
    vehicle: this.create('vehicle'),
    carId: this.create('boolean') ? this.create('carId') : undefined,
    stripePaymentId: undefined,
    votingCategories: [this.create('votingCategory', [{ eventId }])],
    ...overrides,
  })
}