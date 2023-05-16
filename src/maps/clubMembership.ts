import { ClubMembership } from '@/models'
import { ClubMembershipResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapClubMembershipResponseToClubMembership: MapFunction<ClubMembershipResponse, ClubMembership> = function(source) {
  return {
    clubMembershipId: source._id.toString(),
    clubId: source.clubId,
    userId: source.userId,
    clubPermissions: source.clubPermissions,
    user: this.map('GoTrueUser', source.user, 'User'),
  }
}