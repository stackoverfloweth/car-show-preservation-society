import { ObjectId } from 'mongodb'

export type ClubApplicationResponse = {
  _id: ObjectId,
  clubId: string,
  userId: string,
  message?: string,
}

export function isClubApplicationResponse(value: unknown): value is ClubApplicationResponse {
  return !!value && typeof value === 'object'
    && '_id' in value
    && 'clubId' in value && typeof value.clubId === 'string'
    && 'userId' in value && typeof value.userId === 'string'
}