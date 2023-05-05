import { ObjectId } from 'mongodb'

export type ClubInviteResponse = {
  _id: ObjectId,
  clubId: string,
  emailAddress: string,
  clubPermissions: string[],
}

export function isClubInviteResponse(value: unknown): value is ClubInviteResponse {
  return !!value && typeof value === 'object'
    && '_id' in value
    && 'clubId' in value && typeof value.clubId === 'string'
    && 'emailAddress' in value && typeof value.emailAddress === 'string'
}