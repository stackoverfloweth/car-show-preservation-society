import { Ballot } from '@/models/ballot'
import { currentUser } from '@/services/auth'
import { MockFunction } from '@/services/mocker'

export const randomBallot: MockFunction<Ballot, [number, Partial<Ballot>?]> = function(index, overrides) {
  const isDriver = this.create('boolean')

  return {
    ballotId: this.create('id'),
    name: `${currentUser.displayName.slice(0, 2) }000${index}`,
    votes: this.createMany('ballotVotingCategory', 20),
    registrationId: isDriver ? this.create('id') : undefined,
    clubMembershipId: isDriver ? undefined : this.create('id'),
    ...overrides,
  }
}