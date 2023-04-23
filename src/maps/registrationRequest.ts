import { Registration } from '@/models'
import { RegistrationRequest } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapRegistrationToRegistrationRequest: MapFunction<Registration, RegistrationRequest> = function(source) {
  return {
    eventId: source.eventId,
    stripePaymentId: source.stripePaymentId,
    userId: source.userId,
    vehicleId: source.vehicleId,
    votingCategoryIds: source.votingCategories.map(category => category.votingCategoryId),
  }
}