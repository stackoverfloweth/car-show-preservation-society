import { ObjectId } from 'mongodb'
import { VotingCategoryResponse } from '@/models/api/votingCategoryResponse'

export type BallotVotingCategoryResponse = {
  _id: ObjectId,
  votingCategory: VotingCategoryResponse,
  carId?: string,
  disqualified?: boolean,
}