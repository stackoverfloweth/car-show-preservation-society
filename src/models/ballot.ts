import { BallotVotingCategory } from '@/models/ballotVotingCategory'

export type Ballot = {
  ballotId: string,
  name: string,
  registrationId?: string,
  clubMembershipId?: string,
  // this should have each category, initially all with null carId
  votes: BallotVotingCategory[],
}

export type MemberBallot = Ballot & {
  clubMembershipId: string,
}

export type DriverBallot = Ballot & {
  registrationId: string,
}