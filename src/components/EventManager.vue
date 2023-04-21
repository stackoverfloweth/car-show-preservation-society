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

    <template v-if="event.isToday && !event.votingOpen">
      <p-card class="event-manager__voting">
        <PageHeader heading="Voting Opens Soon" />
        <div class="event-manager__voting-times">
          <p-tag>{{ format(event.votingStart ?? event.start, 'pp') }}</p-tag> to <p-tag>{{ format(event.votingEnd ?? event.end, 'pp') }}</p-tag>
        </div>
        <p-link>Start Voting Now</p-link>
      </p-card>
    </template>

    <template v-if="event.votingOpen">
      <p-card class="event-manager__voting">
        <PageHeader heading="Voting Is Open" />
        <div class="event-manager__voting-times">
          <p-tag>{{ format(event.votingStart ?? event.start, 'pp') }}</p-tag> to <p-tag>{{ format(event.votingEnd ?? event.end, 'pp') }}</p-tag>
        </div>
        <p-link>End Voting Now</p-link>
      </p-card>

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

    <p-card class="event-manager__registrations">
      <PageHeader heading="Registrations" />
      here are all the registered drivers
      <template v-if="event.registrationOpen">
        <p-button>Check-in</p-button>
        <!-- communicate if registration is paid or not, what do they owe -->
        <p-button>New Registration</p-button>
        <!-- find existing user, if new user system should contact them to finish profile -->
      </template>
    </p-card>

    <template v-if="event.registrationOpen">
      <p-card class="event-manager__judging-categories">
        <PageHeader heading="Review Judging Categories" />
        assign registrations to their correct voting category
      </p-card>
    </template>

    <p-card class="event-manager__messaging">
      <PageHeader heading="Messages" />
      send event messages (coming soon!)
    </p-card>

    <EventBallots :event="event" />
  </div>
</template>

<script lang="ts" setup>
  import { BooleanRouteParam, useRouteQueryParam } from '@prefecthq/vue-compositions'
  import { format } from 'date-fns'
  import EventBallots from '@/components/EventBallots.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    event: Event,
  }>()

  const emit = defineEmits<{
    (event: 'open:club', value: string): void,
    (event: 'open:event', value: Event): void,
  }>()

  const isViewing = useRouteQueryParam('is-viewing', BooleanRouteParam, false)

  function openRelatedClub(clubId: string): void {
    emit('open:club', clubId)
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
</style>