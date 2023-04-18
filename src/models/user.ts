import { Image } from '@/models/image'
import { Location } from '@/models/location'

export type User = {
  userId: string,
  emailAddress?: string,
  phoneNumber?: string,
  firstName?: string,
  lastName?: string,
  location?: Location,
  profileImage?: Image,
  stripeCustomerId?: string,
  hideEmailAddress?: boolean,
  hidePhoneNumber?: boolean,
  hideLocation?: boolean,
  displayNameOverride?: string,
}