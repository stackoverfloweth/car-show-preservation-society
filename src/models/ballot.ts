import { BallotVotingCategory } from '@/models/ballotVotingCategory'
import { currentUser } from '@/services/auth'

export interface IBallot {
  ballotId: string,
  index: number,
  registrationId?: string,
  clubMembershipId?: string,
  votes: BallotVotingCategory[],
}

export class Ballot {
  public readonly ballotId: string
  public index: number
  public registrationId?: string
  public clubMembershipId?: string
  public votes: BallotVotingCategory[]

  public constructor(ballot: IBallot) {
    this.ballotId = ballot.ballotId
    this.index = ballot.index
    this.registrationId = ballot.registrationId
    this.clubMembershipId = ballot.clubMembershipId
    this.votes = ballot.votes
  }

  public get name(): string {
    const id = currentUser().emailAddress ?? currentUser().userId
    return `${id.slice(0, 2) }${String(this.index + 1).padStart(4, '0')}`
  }
}

export type MemberBallot = Ballot & {
  clubMembershipId: string,
}

export type DriverBallot = Ballot & {
  registrationId: string,
}