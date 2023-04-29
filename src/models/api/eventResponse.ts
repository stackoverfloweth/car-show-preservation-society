import { ObjectId } from 'mongodb'
import { Location } from '@/models'
import { ImageResponse } from '@/models/api/imageResponse'

export type EventResponse = {
  _id: ObjectId,
  contactUserId?: string,
  name: string,
  description?: string,
  image?: ImageResponse,
  images?: ImageResponse[],
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
  isDeleted?: boolean,
}