<template>
  <div class="today-view-page">
    <template v-if="eventsCurrentlyHappening.length">
      <PageHeader heading="Happening Now" />
      <EventsList :events="eventsCurrentlyHappening" />
    </template>

    <template v-if="recentPlacements.length">
      <PageHeader heading="Recent Shows" />
      <template v-for="placement in recentPlacements" :key="placement.event.eventId">
        <VotingResultsByEventAndCategoryItem v-bind="placement" />
      </template>
    </template>

    <div class="today-view-page__upcoming-events">
      <PageHeader heading="Upcoming Events" />
      <EventsList :events="upcomingEvents" />
    </div>

    <p-link :to="routes.events()">
      See All Events
    </p-link>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventsList from '@/components/EventsList.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import VotingResultsByEventAndCategoryItem from '@/components/VotingResultsByEventAndCategoryItem.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services/auth'

  const api = useApi()
  useNavigation({})

  const eventsCurrentlyHappeningSubscriptions = useSubscription(api.events.getEventsHappeningNow, [])
  const eventsCurrentlyHappening = computed(() => eventsCurrentlyHappeningSubscriptions.response ?? [])

  const recentPlacementsSubscriptions = useSubscription(api.voting.getRecentPlacements, [currentUser.userId])
  const recentPlacements = computed(() => recentPlacementsSubscriptions.response ?? [])

  const upcomingEventsSubscriptions = useSubscription(api.events.getUpcomingEvents, [])
  const upcomingEvents = computed(() => upcomingEventsSubscriptions.response ?? [])
</script>

<style>
.today-view-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-4);
  gap: var(--space-4);
}
</style>