import { ObjectId } from 'mongodb'
import { ImageResponse } from '@/models/api/imageResponse'
import { Location } from '@/models/location'

export type UserResponse = {
  _id: ObjectId,
  identityId: string,
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
}