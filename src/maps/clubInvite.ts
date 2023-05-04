import { ClubInvite } from '@/models'
import { ClubInviteResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapClubInviteResponseToClubInvite: MapFunction<ClubInviteResponse, ClubInvite> = function(source) {
  return {
    clubInviteId: source._id.toString(),
    clubId: source.clubId,
    emailAddress: source.emailAddress,
    clubPermissions: source.clubPermissions,
  }
}