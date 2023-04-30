import { ObjectId } from 'mongodb'

export type VotingCategoryResponse = {
  _id: ObjectId,
  eventId: string,
  name: string,
  description?: string,
  maxCapacity?: number,
  driversOnly?: boolean,
  membersOnly?: boolean,
  automaticEntry?: boolean,
  featured?: boolean,
  stripePriceId?: string,
  currentCapacity?: number,
}