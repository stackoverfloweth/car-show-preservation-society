import { VotingResult } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResult: MockFunction<VotingResult, [Partial<VotingResult>?]> = function(overrides = {}) {
  const placeNumber = this.create('number', [1, 6])

  return {
    eventId: this.create('id').toString(),
    votingCategoryId: this.create('id').toString(),
    registration: this.create('registration'),
    place: placeNumber.toString(),
    placeNumber,
    ...overrides,
  }
}