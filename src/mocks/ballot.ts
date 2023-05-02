import { Ballot } from '@/models/ballot'
import { MockFunction } from '@/services/mocker'

export const randomBallot: MockFunction<Ballot, [number, Partial<Ballot>?]> = function(index, overrides) {
  const isDriver = this.create('boolean')

  return new Ballot({
    ballotId: this.create('id'),
    index,
    votes: this.createMany('ballotVotingCategory', 20),
    registrationId: isDriver ? this.create('id') : undefined,
    clubMembershipId: isDriver ? undefined : this.create('id'),
    ...overrides,
  })
}