import { ImageRequest } from '@/models/api/imageRequest'

export type ClubRequest = {
  clubId?: string,
  name: string,
  description?: string,
  contactUserId?: string,
  stripeCustomerId?: string,
  image?: ImageRequest,
  joinableByAnyone?: boolean,
  joinableByApplication?: boolean,
}