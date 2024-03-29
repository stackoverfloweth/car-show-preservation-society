export type VotingCategoryRequest = {
  votingCategoryId?: string,
  eventId: string,
  name: string,
  description?: string,
  maxCapacity?: number,
  driversOnly?: boolean,
  membersOnly?: boolean,
  automaticEntry?: boolean,
  featured?: boolean,
  stripePriceId?: string,
}