import { VotingResult } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResult: MockFunction<VotingResult, [Partial<VotingResult>?]> = function(overrides = {}) {
  const placeNumber = this.create('number', [1, 6])

  return {
    votingResultId: this.create('id'),
    eventId: this.create('id'),
    votingCategoryId: this.create('id'),
    registration: this.create('registration'),
    place: placeNumber.toString(),
    placeNumber,
    ...overrides,
  }
}