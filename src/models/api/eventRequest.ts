import { Location, Image } from '@/models'

export type EventRequest = {
  name?: string,
  description?: string,
  eventLogo?: Image,
  location?: Location,
  clubId?: string,
  start?: Date,
  end?: Date,
}