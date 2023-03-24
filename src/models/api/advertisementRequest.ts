import { Image } from '@/models/image'
import { Size } from '@/models/size'

export type AdvertisementRequest = {
  image?: Image,
  title?: string,
  description?: string,
  href?: string,
  size?: Size,
}