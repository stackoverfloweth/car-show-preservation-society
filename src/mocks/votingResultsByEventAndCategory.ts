import { VotingResultsByEventAndCategory } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResultsByEventAndCategory: MockFunction<VotingResultsByEventAndCategory, [Partial<VotingResultsByEventAndCategory>?]> = function(overrides = {}) {
  return {
    event: this.create('event'),
    votingCategory: this.create('votingCategory'),
    result: this.create('votingResult'),
    ...overrides,
  }
}