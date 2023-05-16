import { VehicleRequest } from '@/models/api/vehicleRequest'

export type RegistrationRequest = {
  registrationId?: string,
  eventId: string,
  stripePaymentId?: string,
  userId: string,
  vehicleId?: string,
  votingCategoryIds: string[],
}

export type NewUserRegistrationRequest = RegistrationRequest & {
  emailAddress?: string,
  vehicle: VehicleRequest,
}