import { ObjectId } from 'mongodb'
import { ImageResponse } from '@/models/api/imageResponse'
import { Size } from '@/models/size'

export type AdvertisementResponse = {
  _id: ObjectId,
  eventId?: string,
  clubId?: string,
  image?: ImageResponse,
  title?: string,
  description?: string,
  href?: string,
  size?: Size,
}