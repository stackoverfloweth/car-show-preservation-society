export type Ballot = {
  ballotId: string,
  name: string,
  registrationId?: string,
  clubMembershipId?: string,
}

export type MemberBallot = Ballot & {
  clubMembershipId: string,
}

export type DriverBallot = Ballot & {
  registrationId: string,
}