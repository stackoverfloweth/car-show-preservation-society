import { User } from 'gotrue-js'
import { ObjectId } from 'mongodb'

export type ClubMembershipResponse = {
  _id: ObjectId,
  clubId: string,
  userId: string,
  clubPermissions: string[],
  user?: User,
}

export function isClubMembershipResponse(value: unknown): value is ClubMembershipResponse {
  return !!value && typeof value === 'object'
    && '_id' in value
    && 'clubId' in value && typeof value.clubId === 'string'
    && 'userId' in value && typeof value.userId === 'string'
    && 'clubPermissions' in value && Array.isArray(value.clubPermissions)
}