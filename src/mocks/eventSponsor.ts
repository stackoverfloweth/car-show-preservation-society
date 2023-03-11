import { EventSponsor } from '@/models/eventSponsor'
import { MockFunction } from '@/services/mocker'

export const randomEventSponsor: MockFunction<EventSponsor, [Partial<EventSponsor>?]> = function(overrides) {
  return {
    eventSponsorId: this.create('id'),
    eventId: this.create('id'),
    googleAdId: this.create('id'),
    ...overrides,
  }
}