import { ObjectId } from 'mongodb'

export type ClubInviteResponse = {
  _id: ObjectId,
  clubId: string,
  emailAddress: string,
  clubPermissions: string[],
}