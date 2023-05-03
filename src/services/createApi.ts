import { createActions } from '@prefecthq/vue-compositions'
import { InjectionKey } from 'vue'
import { AdvertisementsApi } from '@/services/advertisementsApi'
import { ApiConfig } from '@/services/api'
import { BallotsApi } from '@/services/ballotsApi'
import { ClubImagesApi } from '@/services/clubImagesApi'
import { ClubInvitationsApi } from '@/services/clubInvitationsApi'
import { ClubMembershipApi } from '@/services/clubMembershipApi'
import { ClubsApi } from '@/services/clubsApi'
import { EventImagesApi } from '@/services/eventImagesApi'
import { EventsApi } from '@/services/eventsApi'
import { RegistrationsApi } from '@/services/registrationApi'
import { UsersApi } from '@/services/usersApi'
import { VehicleImagesApi } from '@/services/vehicleImagesApi'
import { VehiclesApi } from '@/services/vehiclesApi'
import { VotingCategoriesApi } from '@/services/votingCategoryApi'
import { VotingResultsApi } from '@/services/votingResultsApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    advertisements: createActions(new AdvertisementsApi(config)),
    ballots: createActions(new BallotsApi(config)),
    clubImages: createActions(new ClubImagesApi(config)),
    clubInvitations: createActions(new ClubInvitationsApi(config)),
    clubMembership: createActions(new ClubMembershipApi(config)),
    clubs: createActions(new ClubsApi(config)),
    events: createActions(new EventsApi(config)),
    eventImages: createActions(new EventImagesApi(config)),
    registration: createActions(new RegistrationsApi(config)),
    users: createActions(new UsersApi(config)),
    vehicles: createActions(new VehiclesApi(config)),
    vehicleImages: createActions(new VehicleImagesApi(config)),
    votingResults: createActions(new VotingResultsApi(config)),
    votingCategories: createActions(new VotingCategoriesApi(config)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')