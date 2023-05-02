import { Location } from '@/models'
import { ImageRequest } from '@/models/api/imageRequest'

export type UserRequest = {
  userId?: string,
  emailAddress?: string,
  phoneNumber?: string,
  firstName?: string,
  lastName?: string,
  location?: Location,
  image?: ImageRequest,
  stripeCustomerId?: string,
  hideEmailAddress?: boolean,
  hidePhoneNumber?: boolean,
  hideLocation?: boolean,
  displayNameOverride?: string,
}