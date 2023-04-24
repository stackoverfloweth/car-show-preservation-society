import { VotingResult } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResult: MockFunction<VotingResult, [Partial<VotingResult>?]> = function(overrides = {}) {
  return {
    registration: this.create('registration'),
    votingCategoryId: this.create('id'),
    place: this.create('number').toString(),
    ...overrides,
  }
}