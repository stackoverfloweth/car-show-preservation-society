import { BallotVotingCategory } from '@/models'
import { BallotVotingCategoryResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapBallotVotingCategoryResponseToBallotVotingCategory: MapFunction<BallotVotingCategoryResponse, BallotVotingCategory> = function(source) {
  return {
    ballotVotingCategoryId: source._id.toString(),
    votingCategory: this.map('VotingCategoryResponse', source.votingCategory, 'VotingCategory'),
    carId: source.carId,
    disqualified: source.disqualified,
  }
}