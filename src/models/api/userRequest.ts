import { Location } from '@/models'

export type UserRequest = {
  emailAddress?: string,
  phoneNumber?: string,
  firstName?: string,
  lastName?: string,
  location?: Location,
  stripeCustomerId?: string,
  hideEmailAddress?: boolean,
  hidePhoneNumber?: boolean,
  hideLocation?: boolean,
  displayNameOverride?: string,
}