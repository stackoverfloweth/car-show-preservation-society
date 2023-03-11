import { Ballot } from '@/models/ballot'
import { MockFunction } from '@/services/mocker'

export const randomBallot: MockFunction<Ballot, [Partial<Ballot>?]> = function(overrides) {
  const isDriver = this.create('boolean')

  return {
    ballotId: this.create('id'),
    registrationId: isDriver ? this.create('id') : undefined,
    clubMembershipId: isDriver ? undefined : this.create('id'),
    ...overrides,
  }
}