import { Location, ImageRequest } from '@/models'

export type EventRequest = {
  eventId?: string,
  name?: string,
  description?: string,
  image?: ImageRequest,
  location?: Location,
  clubId?: string,
  contactUserId?: string,
  start?: Date,
  end?: Date,
}