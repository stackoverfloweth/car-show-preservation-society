import { ImageRequest } from '@/models/api/imageRequest'

export type ClubRequest = {
  clubId?: string,
  name?: string,
  description?: string,
  stripeCustomerId?: string,
  clubLogo?: ImageRequest,
  joinableByAnyone?: boolean,
  joinableByApplication?: boolean,
}