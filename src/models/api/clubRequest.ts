import { Image } from '@/models/image'

export type ClubRequest = {
  clubId?: string,
  name?: string,
  description?: string,
  stripeCustomerId?: string,
  clubLogo?: Image,
  joinableByAnyone?: boolean,
  joinableByApplication?: boolean,
}