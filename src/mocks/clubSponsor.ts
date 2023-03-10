import { ClubSponsor } from '@/models/clubSponsor'
import { MockFunction } from '@/services/mocker'

export const randomClubSponsor: MockFunction<ClubSponsor, []> = function() {
  return {
    clubSponsorId: this.create('id'),
    clubId: this.create('id'),
    googleAdId: this.create('id'),
  }
}