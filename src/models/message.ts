export type Message = {
  messageId: string,
  eventId?: string,
  clubId?: string,
  sentDate?: Date,
  readDate?: Date,
  subject?: string,
  body: string,
  fromUserId: string,
  toUserId?: string,
}

export type EventMessage = Message & {
  eventId: string,
}

export type ClubMessage = Message & {
  clubId: string,
}

export type DriverMessage = Message & {
  eventId: undefined,
  clubId: undefined,
  toUserId: string,
}