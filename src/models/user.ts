import { Location } from '@/models/location'

export type User = {
  userId: string,
  emailAddress?: string,
  phoneNumber?: string,
  firstName?: string,
  lastName?: string,
  location?: Location,
  profileImage?: string,
  stripeCustomerId?: string,
}