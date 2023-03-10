import { Registration } from '@/models/registration'
import { MockFunction } from '@/services/mocker'

export const randomRegistration: MockFunction<Registration, []> = function() {
  return {
    registrationId: this.create('id'),
    registrationCode: this.create('string'),
    userId: this.create('id'),
    eventId: this.create('id'),
    registrationDate: this.create('date'),
    vehicleId: this.create('id'),
    carId: this.create('number').toString(),
    stripePaymentId: undefined,
  }
}