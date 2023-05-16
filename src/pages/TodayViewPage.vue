<template>
  <div class="today-view-page">
    <div class="today-view-page__branding">
      <img class="today-view-page__branding-logo" src="/csps-full.svg">
    </div>
    <template v-if="eventsCurrentlyHappening.length">
      <PageHeader heading="Happening Now" />
      <EventsList :events="eventsCurrentlyHappening" />
    </template>

    <template v-if="recentPlacements.length">
      <PageHeader heading="Recent Shows" />
      <template v-for="placement in recentPlacements" :key="placement.event.eventId">
        <VotingResultByEventAndCategoryItem v-bind="placement" />
      </template>
    </template>

    <div class="today-view-page__upcoming-events">
      <PageHeader heading="Upcoming Events" />
      <EventsList :events="upcomingEvents" />
    </div>

    <div class="today-view-page__actions">
      <p-link :to="routes.events()">
        See All Events
      </p-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventsList from '@/components/EventsList.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import VotingResultByEventAndCategoryItem from '@/components/VotingResultByEventAndCategoryItem.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'
  import { currentUser, isLoggedIn } from '@/services/auth'

  const api = useApi()
  useNavigation({})

  const eventsCurrentlyHappeningSubscriptions = useSubscription(api.events.getEventsHappeningNow, [])
  const eventsCurrentlyHappening = computed(() => eventsCurrentlyHappeningSubscriptions.response ?? [])

  const recentPlacementsSubscriptionsArgs = computed<Parameters<typeof api.votingResults.getRecentPlacements> | null>(() => isLoggedIn() ? [currentUser().userId] : null)
  const recentPlacementsSubscriptions = useSubscriptionWithDependencies(api.votingResults.getRecentPlacements, recentPlacementsSubscriptionsArgs)
  const recentPlacements = computed(() => recentPlacementsSubscriptions.response ?? [])

  const upcomingEventsSubscriptions = useSubscription(api.events.getUpcomingEvents, [])
  const upcomingEvents = computed(() => upcomingEventsSubscriptions.response ?? [])
</script>

<style>
.today-view-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-lg) var(--space-md);
  gap: var(--space-md);
}

.today-view-page__branding {
  display: flex;
  justify-content: center;
}

.today-view-page__branding-logo {
  width: 50%;
  padding-bottom: var(--space-lg);
}
</style>