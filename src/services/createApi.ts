import { createActions } from '@prefecthq/vue-compositions'
import { InjectionKey } from 'vue'
import { ApiConfig } from '@/services/api'
import { EventsApi } from '@/services/eventsApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    events: createActions(new EventsApi(config)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')