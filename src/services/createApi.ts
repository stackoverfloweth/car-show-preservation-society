import { createActions } from '@prefecthq/vue-compositions'
import { InjectionKey } from 'vue'
import { ApiConfig } from '@/services/api'
import { ClubsApi } from '@/services/clubsApi'
import { EventsApi } from '@/services/eventsApi'
import { UsersApi } from '@/services/userApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    clubs: createActions(new ClubsApi(config)),
    events: createActions(new EventsApi(config)),
    users: createActions(new UsersApi(config)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')