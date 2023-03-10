import { ClubSubscription } from '@/models/clubSubscription'
import { MockFunction } from '@/services/mocker'

export const randomClubSubscription: MockFunction<ClubSubscription, []> = function() {
  return {
    clubSubscriptionId: this.create('id'),
    clubId: this.create('id'),
    emailAddress: this.create('email'),
    phoneNumber: this.create('number').toString(),
  }
}