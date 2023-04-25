import { VotingResultsByEvent } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResultsByEvent: MockFunction<VotingResultsByEvent, [Partial<VotingResultsByEvent>?]> = function(overrides = {}) {
  return {
    event: this.create('event'),
    result: this.create('votingResult'),
    ...overrides,
  }
}