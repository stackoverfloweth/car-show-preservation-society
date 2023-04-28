import { BallotVotingCategory } from '@/models/ballotVotingCategory'
import { MockFunction } from '@/services/mocker'

export const randomBallotVotingCategory: MockFunction<BallotVotingCategory, [Partial<BallotVotingCategory>?]> = function(overrides) {
  return {
    ballotVotingCategoryId: this.create('id').toString(),
    ballotId: this.create('id').toString(),
    votingCategory: this.create('votingCategory'),
    carId: this.create('boolean') ? this.create('carId') : undefined,
    disqualified: false,
    ...overrides,
  }
}