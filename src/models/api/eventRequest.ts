import { Location, Image } from '@/models'

export type EventRequest = {
  contactUserId?: string,
  name: string,
  description: string,
  eventLogo?: Image,
  location: Location,
  clubId: string,
  start: Date,
  end: Date,
  votingStart?: Date,
  votingEnd?: Date,
  maxCapacity?: number,
  stripePriceId?: string,
  preRegistration?: boolean,
  preRegistrationStripePriceId?: string,
  preRegistrationUnpaid?: boolean,
  ballotCount?: number,
  canVoteForSelf?: boolean,
  driverSelfCategorization?: boolean,
  stripeCrossProductIds: string[],
}