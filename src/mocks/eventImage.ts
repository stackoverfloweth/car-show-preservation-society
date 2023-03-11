import { EventImage } from '@/models/eventImage'
import { MockFunction } from '@/services/mocker'

export const randomEventImage: MockFunction<EventImage, [Partial<EventImage>?]> = function(overrides) {
  return {
    eventImageId: this.create('id'),
    eventId: this.create('id'),
    source: this.create('image'),
    ...overrides,
  }
}