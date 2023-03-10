import { Event } from '@/models/event'
import { MockFunction } from '@/services/mocker'

export const randomEvent: MockFunction<Event, []> = function() {
  const start = this.create('date')
  const votingStart = this.create('date')

  return {
    eventId: this.create('id'),
    contactUserId: this.create('boolean') ? this.create('id') : undefined,
    name: `${this.create('adjective') } ${ this.create('noun')}`,
    description: this.create('paragraph'),
    location: this.create('location'),
    clubId: this.create('id'),
    start,
    end: this.create('date', [start]),
    votingStart,
    votingEnd: this.create('date', [votingStart]),
    maxCapacity: this.create('boolean') ? this.create('number') : undefined,
    stripePriceId: undefined,
    preRegistration: true,
    preRegistrationStripePriceId: undefined,
    preRegistrationUnpaid: true,
    ballotCount: this.create('number', [1, 3]),
    canVoteForSelf: this.create('boolean'),
    driverSelfCategorization: this.create('boolean'),
    stripeCrossProductIds: [],
  }
}