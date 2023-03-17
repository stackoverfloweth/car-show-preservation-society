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
  hasVoting?: boolean,
  votingStart?: Date,
  votingEnd?: Date,
  maxCapacity?: number,
  priceInPennies?: number,
  preRegistration?: boolean,
  preRegistrationPriceInPennies?: string,
  preRegistrationUnpaid?: boolean,
  ballotCount?: number,
  canVoteForSelf?: boolean,
  driverSelfCategorization?: boolean,
  stripeCrossProductIds: string[],
}