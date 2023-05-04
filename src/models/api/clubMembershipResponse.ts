import { ObjectId } from 'mongodb'

export type ClubMembershipResponse = {
  _id: ObjectId,
  clubId: string,
  userId: string,
  clubPermissions: string[],
}