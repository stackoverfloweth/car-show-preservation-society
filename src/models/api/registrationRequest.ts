import { UserRequest } from '@/models/api/userRequest'
import { VehicleRequest } from '@/models/api/vehicleRequest'

export type RegistrationRequest = {
  userId: string,
  eventId: string,
  vehicleId?: string,
  stripePaymentId?: string,
  votingCategoryIds?: string[],
}

export type NewUserRegistrationRequest = {
  user: UserRequest,
  eventId: string,
  vehicle: VehicleRequest,
  stripePaymentId?: string,
  votingCategoryIds?: string[],
}