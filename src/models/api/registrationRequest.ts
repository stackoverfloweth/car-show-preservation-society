import { UserRequest } from '@/models/api/userRequest'
import { VehicleRequest } from '@/models/api/vehicleRequest'

export type RegistrationRequest = {
  registrationId?: string,
  userId: string,
  eventId: string,
  vehicleId?: string,
  stripePaymentId?: string,
  votingCategoryIds?: string[],
}

export type NewUserRegistrationRequest = RegistrationRequest & {
  user: UserRequest,
  vehicle: VehicleRequest,
}