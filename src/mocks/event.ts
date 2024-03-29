import { Event } from '@/models/event'
import { MockFunction } from '@/services'
import { capitalize, toOrdinal } from '@/utilities'

export const randomEvent: MockFunction<Event, [Partial<Event>?]> = function(overrides) {
  const start = this.create('date', [new Date()])

  return new Event({
    eventId: this.create('id'),
    contactUserId: this.create('id'),
    name: `${toOrdinal(this.create('number', [5, 100]))} Annual ${capitalize(this.create('adjective')) } ${ capitalize(this.create('noun'))}`,
    description: this.create('paragraph'),
    location: this.create('location'),
    clubId: this.create('id'),
    image: this.create('image'),
    start,
    end: this.create('date', [start]),
    maxCapacity: this.create('boolean') ? this.create('number') : undefined,
    stripePriceId: undefined,
    preRegistration: true,
    preRegistrationStripePriceId: undefined,
    preRegistrationUnpaid: true,
    ballotCount: this.create('number', [1, 3]),
    canVoteForSelf: this.create('boolean'),
    driverSelfCategorization: this.create('boolean'),
    stripeCrossProductIds: [],
    isDraft: this.create('boolean'),
    maxSelfCategorization: 1,
    ...overrides,
  })
}