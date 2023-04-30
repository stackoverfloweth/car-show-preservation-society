import { ObjectId } from 'mongodb'
import { Location } from '@/models'
import { ImageResponse } from '@/models/api/imageResponse'

export type UserResponse = {
  _id: ObjectId,
  emailAddress?: string,
  phoneNumber?: string,
  firstName?: string,
  lastName?: string,
  location?: Location,
  image?: ImageResponse,
  stripeCustomerId?: string,
  hideEmailAddress?: boolean,
  hidePhoneNumber?: boolean,
  hideLocation?: boolean,
  displayNameOverride?: string,
  isDeleted?: boolean,
}