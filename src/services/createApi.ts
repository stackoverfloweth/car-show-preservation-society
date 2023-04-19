import { createActions } from '@prefecthq/vue-compositions'
import { InjectionKey } from 'vue'
import { AdvertisementsApi } from '@/services/advertisementsApi'
import { ApiConfig } from '@/services/api'
import { ClubImagesApi } from '@/services/clubImagesApi'
import { ClubInvitationsApi } from '@/services/clubInvitationsApi'
import { ClubMembershipApi } from '@/services/clubMembershipApi'
import { ClubsApi } from '@/services/clubsApi'
import { EventsApi } from '@/services/eventsApi'
import { UsersApi } from '@/services/usersApi'
import { VehiclesApi } from '@/services/vehiclesApi'
import { VotingCategoriesApi } from '@/services/votingCategoryApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    advertisements: createActions(new AdvertisementsApi(config)),
    clubImages: createActions(new ClubImagesApi(config)),
    clubInvitations: createActions(new ClubInvitationsApi(config)),
    clubMembership: createActions(new ClubMembershipApi(config)),
    clubs: createActions(new ClubsApi(config)),
    events: createActions(new EventsApi(config)),
    users: createActions(new UsersApi(config)),
    vehicles: createActions(new VehiclesApi(config)),
    votingCategories: createActions(new VotingCategoriesApi(config)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')