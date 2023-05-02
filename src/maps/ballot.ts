import { Ballot } from '@/models'
import { BallotResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapBallotResponseToBallot: MapFunction<BallotResponse, Ballot> = function(source) {
  return new Ballot({
    ballotId: source._id.toString(),
    index: source.index,
    registrationId: source.registrationId,
    clubMembershipId: source.clubMembershipId,
    votes: this.map('BallotVotingCategoryResponse', source.votes, 'BallotVotingCategory'),
  })
}