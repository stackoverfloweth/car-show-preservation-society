import { Image } from '@/models/image'

export type Club = {
  clubId: string,
  name: string,
  description: string,
  contactUserId?: string,
  stripeCustomerId?: string,
  clubLogo?: Image,
  joinableByAnyone?: boolean,
  joinableByApplication?: boolean,
}