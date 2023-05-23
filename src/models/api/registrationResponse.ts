import { ObjectId } from 'mongodb'
import { UserResponse } from '@/models/api/userResponse'
import { VehicleResponse } from '@/models/api/vehicleResponse'

export type RegistrationResponse = {
  _id: ObjectId,
  registrationCode: string,
  eventId: string,
  registrationDate: Date,
  checkInDate?: Date,
  carId?: string,
  stripePaymentId?: string,
  userId: string,
  user: UserResponse,
  vehicleId?: string,
  vehicle: VehicleResponse,
  votingCategoryIds: string[],
  isDeleted?: boolean,
}