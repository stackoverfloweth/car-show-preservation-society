import { ClubSubscription } from '@/models/clubSubscription'
import { MockFunction } from '@/services/mocker'

export const randomClubSubscription: MockFunction<ClubSubscription, [Partial<ClubSubscription>]> = function(overrides) {
  return {
    clubSubscriptionId: this.create('id').toString(),
    clubId: this.create('id').toString(),
    emailAddress: this.create('email'),
    phoneNumber: this.create('number').toString(),
    ...overrides,
  }
}