import { Location } from '@/models'
import { ImageRequest } from '@/models/api/imageRequest'

export type EventRequest = {
  eventId?: string,
  contactUserId?: string,
  name: string,
  description?: string,
  image?: ImageRequest,
  location?: Location,
  clubId: string,
  start: string,
  end: string,
  votingStart?: string,
  votingEnd?: string,
  mustBePresentToWin?: boolean,
  maxCapacity?: number,
  stripePriceId?: string,
  preRegistration?: boolean,
  preRegistrationStripePriceId?: string,
  preRegistrationUnpaid?: boolean,
  ballotCount?: number,
  canVoteForSelf?: boolean,
  driverSelfCategorization?: boolean,
  maxSelfCategorization?: number,
  stripeCrossProductIds?: string[],
  isDraft?: boolean,
}