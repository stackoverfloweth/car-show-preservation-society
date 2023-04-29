import { ObjectId } from 'mongodb'

export type ImageResponse = {
  _id: ObjectId,
  cloudinaryId: string,
  version: number,
  width: number,
  height: number,
  format: string,
  resource: string,
  bytes: number,
  type: string,
  size?: string,
  position?: string,
  caption?: string,
}