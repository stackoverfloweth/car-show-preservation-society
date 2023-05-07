import { ObjectId } from 'mongodb'
import { UserResponse } from '@/models/api/userResponse'

export type ClubApplicationResponse = {
  _id: ObjectId,
  clubId: string,
  userId: string,
  message?: string,
  user?: UserResponse,
}

export function isClubApplicationResponse(value: unknown): value is ClubApplicationResponse {
  return !!value && typeof value === 'object'
    && '_id' in value
    && 'clubId' in value && typeof value.clubId === 'string'
    && 'userId' in value && typeof value.userId === 'string'
}