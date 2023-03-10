import { BallotVotingCategory } from '@/models/ballotVotingCategory'
import { MockFunction } from '@/services/mocker'

export const randomBallotVotingCategory: MockFunction<BallotVotingCategory, []> = function() {
  return {
    ballotVotingCategoryId: this.create('id'),
    ballotId: this.create('id'),
    votingCategoryId: this.create('id'),
    carId: this.create('number').toString(),
    disqualified: false,
  }
}