import { ObjectId } from 'mongodb'
import { UserResponse } from '@/models/api/userResponse'

export type ClubMembershipResponse = {
  _id: ObjectId,
  clubId: string,
  userId: string,
  clubPermissions: string[],
  user?: UserResponse,
}

export function isClubMembershipResponse(value: unknown): value is ClubMembershipResponse {
  return !!value && typeof value === 'object'
    && '_id' in value
    && 'clubId' in value && typeof value.clubId === 'string'
    && 'userId' in value && typeof value.userId === 'string'
}