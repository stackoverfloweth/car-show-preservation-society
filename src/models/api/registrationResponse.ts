import { User } from 'gotrue-js'
import { ObjectId } from 'mongodb'
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
  user: User,
  vehicleId?: string,
  vehicle: VehicleResponse,
  votingCategoryIds: string[],
  isDeleted?: boolean,
}