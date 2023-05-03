import { ObjectId } from 'mongodb'
import { RegistrationResponse } from '@/models/api/registrationResponse'

export type VotingResultResponse = {
  _id: ObjectId,
  eventId: string,
  votingCategoryId: string,
  registration: RegistrationResponse,
  place: string,
  placeNumber: number,
}