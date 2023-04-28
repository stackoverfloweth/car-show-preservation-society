import { ClubMembership } from '@/models/clubMembership'
import { MockFunction } from '@/services/mocker'

export const randomClubMembership: MockFunction<ClubMembership, [Partial<ClubMembership>?]> = function(overrides) {
  return {
    clubMembershipId: this.create('id').toString(),
    clubId: this.create('id').toString(),
    userId: this.create('id').toString(),
    clubPermissions: [],
    ...overrides,
  }
}