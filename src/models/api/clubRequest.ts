import { Image } from '@/models/image'

export type ClubRequest = {
  name: string,
  description: string,
  stripeCustomerId?: string,
  clubLogo?: Image,
}