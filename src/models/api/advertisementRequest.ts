import { ImageRequest } from '@/models/api/imageRequest'
import { Size } from '@/models/size'

export type AdvertisementRequest = {
  advertisementId?: string,
  eventId?: string,
  clubId?: string,
  image?: ImageRequest,
  title?: string,
  description?: string,
  href?: string,
  size?: Size,
}