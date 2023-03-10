import { EventImage } from '@/models/eventImage'
import { MockFunction } from '@/services/mocker'

export const randomEventImage: MockFunction<EventImage, []> = function() {
  return {
    eventImageId: this.create('id'),
    eventId: this.create('id'),
    source: this.create('url'),
  }
}