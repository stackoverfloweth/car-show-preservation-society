import { Registration } from '@/models'
import { RegistrationRequest, RegistrationResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapRegistrationResponseToRegistration: MapFunction<RegistrationResponse, Registration> = function(source) {
  return new Registration({
    registrationId: source._id.toString(),
    registrationCode: source.registrationCode,
    eventId: source.eventId,
    registrationDate: source.registrationDate,
    checkInDate: source.checkInDate,
    carId: source.carId,
    stripePaymentId: source.stripePaymentId,
    userId: source.userId,
    user: this.map('GoTrueUser', source.user, 'User'),
    vehicleId: source.vehicleId,
    vehicle: this.map('VehicleResponse', source.vehicle, 'Vehicle'),
    votingCategoryIds: source.votingCategoryIds,
  })
}

export const mapRegistrationToRegistrationRequest: MapFunction<Registration, RegistrationRequest> = function(source) {
  return {
    registrationId: source.registrationId,
    eventId: source.eventId,
    stripePaymentId: source.stripePaymentId,
    userId: source.userId,
    vehicleId: source.vehicleId,
    votingCategoryIds: source.votingCategoryIds,
  }
}