import { ObjectId } from 'mongodb'

export type ClubApplicationResponse = {
  _id: ObjectId,
  clubId: string,
  userId: string,
  message?: string,
}