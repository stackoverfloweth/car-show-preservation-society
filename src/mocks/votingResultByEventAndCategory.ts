import { VotingResultByEventAndCategory } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResultByEventAndCategory: MockFunction<VotingResultByEventAndCategory, [Partial<VotingResultByEventAndCategory>?]> = function(overrides = {}) {
  return {
    event: this.create('event'),
    votingCategory: this.create('votingCategory'),
    result: this.create('votingResult'),
    ...overrides,
  }
}