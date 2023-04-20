import { SortOrder } from '@/types'

export type EventsSort = {
  sort?: 'name' | 'date' | 'location',
  order?: SortOrder,
}