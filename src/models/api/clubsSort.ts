import { SortOrder } from '@/types'

export type ClubsSort = {
  sort?: 'name' | 'created' | 'upcoming-events' | 'members',
  order?: SortOrder,
}