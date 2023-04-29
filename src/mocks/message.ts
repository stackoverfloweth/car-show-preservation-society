import { Message } from '@/models/message'
import { MockFunction } from '@/services/mocker'

export const randomMessage: MockFunction<Message, [Partial<Message>?]> = function(overrides) {
  const isBetweenDrivers = this.create('boolean')
  const isToAllEvent = !isBetweenDrivers && this.create('boolean')

  return {
    messageId: this.create('id'),
    eventId: isToAllEvent ? this.create('id') : undefined,
    clubId: !isBetweenDrivers && !isToAllEvent ? this.create('id') : undefined,
    toUserId: isBetweenDrivers ? this.create('id') : undefined,
    sentDate: this.create('date'),
    readDate: this.create('boolean') ? this.create('date') : undefined,
    subject: this.create('sentence'),
    body: this.create('paragraph'),
    fromUserId: this.create('id'),
    ...overrides,
  }
}