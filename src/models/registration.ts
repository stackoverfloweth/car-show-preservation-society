import { VotingCategory } from '@/models/votingCategory'

export type Registration = {
  registrationId: string,
  registrationCode: string,
  userId: string,
  eventId: string,
  registrationDate: Date,
  vehicleId?: string,
  carId?: string,
  stripePaymentId?: string,
  votingCategories: VotingCategory[],
}