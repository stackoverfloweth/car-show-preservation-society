import { VotingResultsCount } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResultsCount: MockFunction<VotingResultsCount, [Partial<VotingResultsCount>?]> = function(override = {}) {
  const placeNumber = this.create('number')
  return {
    placeNumber,
    place: placeNumber.toString(),
    count: this.create('number', [1, 4]),
    ...override,
  }
}