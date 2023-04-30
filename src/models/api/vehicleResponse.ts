import { ObjectId } from 'mongodb'
import { ImageResponse } from '@/models/api/imageResponse'

export type VehicleResponse = {
  _id: ObjectId,
  userId: string,
  make?: string,
  model?: string,
  year?: string,
  description?: string,
  color?: string,
  modificationCount?: number,
  modifiedAppearance?: boolean,
  image?: ImageResponse,
  images?: ImageResponse[],
  isDeleted?: boolean,
}