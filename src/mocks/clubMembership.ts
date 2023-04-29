import { ClubMembership } from '@/models/clubMembership'
import { MockFunction } from '@/services/mocker'

export const randomClubMembership: MockFunction<ClubMembership, [Partial<ClubMembership>?]> = function(overrides) {
  return {
    clubMembershipId: this.create('id'),
    clubId: this.create('id'),
    userId: this.create('id'),
    clubPermissions: [],
    ...overrides,
  }
}