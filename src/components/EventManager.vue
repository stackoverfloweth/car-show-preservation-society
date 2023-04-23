<template>
  <div class="event-manager">
    <EventHeader :event="event" class="event-manager__header" @club:click="openRelatedClub">
      <template #actions>
        <p-icon-button-menu>
          <p-overflow-menu-item label="Share" icon="ShareIcon" />
          <p-overflow-menu-item label="Edit Event" icon="PencilIcon" :to="routes.eventEditor(event.eventId)" />
          <p-overflow-menu-item label="Public View" icon="EyeIcon" @click="isViewing = true" />
        </p-icon-button-menu>
      </template>
    </EventHeader>

    <template v-if="event.isHappening">
      <div class="event-manager__voting">
        <template v-if="event.votingOpen">
          <p-card class="event-manager__voting-settings">
            <PageHeader heading="Voting Is Open" />
            <div class="event-manager__voting-times">
              {{ format(event.votingEnd ?? event.end, 'pp') }}
            </div>
            <p-link @click="endVotingNow">
              End Voting Now
            </p-link>
          </p-card>
        </template>
        <template v-else>
          <p-card class="event-manager__voting-settings">
            <PageHeader heading="Voting Opens Soon" />
            <div class="event-manager__voting-times">
              {{ format(event.votingStart ?? event.start, 'pp') }}
            </div>
            <p-link @click="startVotingNow">
              Start Voting Now
            </p-link>
          </p-card>
        </template>
        <EventBallots :event="event" />
      </div>
    </template>

    <template v-if="event.votingOpen">
      <p-card class="event-manager__ballots">
        <PageHeader heading="View Ballots" />
        here are state of all ballots, not results
      </p-card>
    </template>

    <template v-else-if="event.isPast">
      <p-card class="event-manager__results">
        <PageHeader heading="View Judging Results" />
        here are the results from all ballots, winners in each category, can disqualify ballots (like if winner wasn't present to win)
      </p-card>
    </template>

    <template v-if="!event.isPast">
      <p-card class="event-manager__registrations">
        <PageHeader heading="Registrations">
          <template #actions>
            <p-button :to="routes.eventRegister(event.eventId)">
              New Registration
            </p-button>
          </template>
        </PageHeader>

        <div class="event-manager__registrations-count">
          {{ checkedInCount }} / {{ registrationsCount }}
        </div>

        <p-label label="Find Registration">
          <p-text-input v-model="searchValue" type="search" />
        </p-label>

        <template v-if="searchResults.length">
          <RegistrationsList :event-id="event.eventId" :registrations="searchResults" />
        </template>
        <template v-else-if="searchDebounced">
          <p>No Results Found</p>
          <p-link @click="searchDebounced = undefined">
            Clear Search
          </p-link>
        </template>

        <div class="event-manager__registration-actions">
          <p-link :to="routes.eventRegistrations(event.eventId)">
            View All Registrations
          </p-link>
        </div>
      </p-card>
    </template>

    <p-card class="event-manager__messaging">
      <PageHeader heading="Messages" />
      (coming soon!)
    </p-card>
  </div>
</template>

<script lang="ts" setup>
  import { BooleanRouteParam, useDebouncedRef, useRouteQueryParam, useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { format } from 'date-fns'
  import { computed, ref } from 'vue'
  import EventBallots from '@/components/EventBallots.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import RegistrationsList from '@/components/RegistrationsList.vue'
  import { useApi } from '@/compositions'
  import { Event, isEnded, isHappening, isToday, votingOpen } from '@/models'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    event: Event,
  }>()

  const emit = defineEmits<{
    (event: 'open:club', value: string): void,
    (event: 'open:event', value: Event): void,
  }>()

  const api = useApi()
  const eventId = computed(() => props.event.eventId)
  const isViewing = useRouteQueryParam('is-viewing', BooleanRouteParam, false)
  const searchValue = ref<string>()
  const searchDebounced = useDebouncedRef(searchValue, 750)

  const searchResultsSubscriptionArgs = computed<Parameters<typeof api.registration.searchRegistrations> | null>(() => searchDebounced.value ? [searchDebounced.value] : null)
  const searchResultsSubscription = useSubscriptionWithDependencies(api.registration.searchRegistrations, searchResultsSubscriptionArgs)
  const searchResults = computed(() => searchResultsSubscription.response ?? [])

  const registrationsSubscription = useSubscription(api.registration.getRegistrationsCount, [eventId])
  const registrationsCount = computed(() => registrationsSubscription.response ?? 0)

  const checkedInSubscription = useSubscription(api.registration.getRegistrationsCheckedInCount, [eventId])
  const checkedInCount = computed(() => checkedInSubscription.response ?? 0)

  function openRelatedClub(clubId: string): void {
    if (!isToday.value) {
      isToday.value = true
    } else {
      isHappening.value = true
    }
    useSubscription(api.events.getEvent, [props.event.eventId]).refresh()

    emit('open:club', clubId)
  }

  function startVotingNow(): void {
    votingOpen.value = true
    useSubscription(api.events.getEvent, [props.event.eventId]).refresh()
  }

  function endVotingNow(): void {
    isEnded.value = true
    useSubscription(api.events.getEvent, [props.event.eventId]).refresh()
  }
</script>

<style>
.event-manager {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  padding-top: 0;
  gap: var(--space-4);
}

.event-manager__header {
  grid-area: header;
  position: sticky;
  top: 0;
  margin-bottom: -10px;
  z-index: var(--z-front);
  padding: var(--space-4) 0;
  background-color: var(--slate-900);
}

.event-manager__voting {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
}

.event-manager__voting-settings {
  display: flex;
  flex-direction: column;
}

.event-manager__voting-times {
  flex-grow: 1;
  font-size: 2rem;
  white-space: nowrap;
}

.event-manager__registrations {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.event-manager__registrations-count {
  font-size: 2rem;
}
</style>