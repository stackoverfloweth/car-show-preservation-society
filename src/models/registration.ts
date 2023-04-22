import { User } from '@/models/user'
import { Vehicle } from '@/models/vehicle'
import { VotingCategory } from '@/models/votingCategory'

export type Registration = {
  registrationId: string,
  registrationCode: string,
  eventId: string,
  registrationDate: Date,
  carId?: string,
  stripePaymentId?: string,
  userId: string,
  user: User,
  vehicleId?: string,
  vehicle: Vehicle,
  votingCategories: VotingCategory[],
}