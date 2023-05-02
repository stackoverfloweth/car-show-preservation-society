import { ObjectId } from 'mongodb'
import { BallotVotingCategoryResponse } from '@/models/api'

export type BallotResponse = {
  _id: ObjectId,
  index: number,
  registrationId?: string,
  clubMembershipId?: string,
  // this should have each category, initially all with null carId
  votes: BallotVotingCategoryResponse[],
}