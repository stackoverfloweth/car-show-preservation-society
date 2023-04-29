import { ObjectId } from 'mongodb'
import { ImageResponse } from '@/models/api/imageResponse'

export type ClubResponse = {
  _id: ObjectId,
  name: string,
  description?: string,
  contactUserId?: string,
  stripeCustomerId?: string,
  image?: ImageResponse,
  joinableByAnyone?: boolean,
  joinableByApplication?: boolean,
  images?: ImageResponse[],
  isDeleted?: boolean,
}