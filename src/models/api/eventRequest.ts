import { Location, Image } from '@/models'

export type EventRequest = {
  eventId?: string,
  name?: string,
  description?: string,
  image?: Image,
  location?: Location,
  clubId?: string,
  contactUserId?: string,
  start?: Date,
  end?: Date,
}