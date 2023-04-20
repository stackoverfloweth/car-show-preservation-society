import { Registration } from '@/models/registration'
import { MockFunction } from '@/services/mocker'

export const randomRegistration: MockFunction<Registration, [Partial<Registration>?]> = function(overrides) {
  const eventId = this.create('id')

  return {
    registrationId: this.create('id'),
    registrationCode: this.create('string'),
    userId: this.create('id'),
    eventId,
    registrationDate: this.create('date'),
    vehicleId: this.create('id'),
    carId: this.create('number').toString(),
    stripePaymentId: undefined,
    votingCategories: [this.create('votingCategory', [{ eventId }])],
    ...overrides,
  }
}