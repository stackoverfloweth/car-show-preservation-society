import { ClubSponsor } from '@/models/clubSponsor'
import { MockFunction } from '@/services/mocker'

export const randomClubSponsor: MockFunction<ClubSponsor, [Partial<ClubSponsor>?]> = function(overrides) {
  return {
    clubSponsorId: this.create('id'),
    clubId: this.create('id'),
    googleAdId: this.create('id'),
    ...overrides,
  }
}