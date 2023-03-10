import { ClubMembership } from '@/models/clubMembership'
import { MockFunction } from '@/services/mocker'

export const randomClubMembership: MockFunction<ClubMembership, []> = function() {
  return {
    clubMembershipId: this.create('id'),
    clubId: this.create('id'),
    userId: this.create('id'),
    clubPermissions: [],
  }
}