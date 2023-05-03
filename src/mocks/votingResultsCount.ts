import { VotingResultsCount } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResultsCount: MockFunction<VotingResultsCount, [Partial<VotingResultsCount>?]> = function(override = {}) {
  const placeNumber = this.create('number')
  return {
    placeNumber,
    count: this.create('number', [1, 4]),
    ...override,
  }
}