import { Location, Image } from '@/models'

export type EventRequest = {
  eventId?: string,
  contactUserId?: string,
  name?: string,
  description?: string,
  eventLogo?: Image,
  location?: Location,
  clubId?: string,
  start?: Date,
  end?: Date,
  votingStart?: Date,
  votingEnd?: Date,
  maxCapacity?: number,
  priceInPennies?: number,
  preRegistration?: boolean,
  preRegistrationPriceInPennies?: number,
  preRegistrationUnpaid?: boolean,
  ballotCount?: number,
  canVoteForSelf?: boolean,
  driverSelfCategorization?: boolean,
  stripeCrossProductIds?: string[],
}