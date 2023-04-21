<template>
  <div class="today-view-page">
    <template v-if="todaysEvents.length">
      <div class="today-view-page__todays-events">
        <PageHeader heading="Happening Now" />
        <template v-for="event in todaysEvents" :key="event.eventId">
          <EventIdCard :event-id="event.eventId" />
        </template>
      </div>
    </template>

    <div class="today-view-page__upcoming-events">
      <PageHeader heading="Upcoming Events" />
      <EventsList :events="upcomingEvents" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventIdCard from '@/components/EventIdCard.vue'
  import EventsList from '@/components/EventsList.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { useApi, useNavigation } from '@/compositions'

  const api = useApi()
  useNavigation({})

  const todaysEventsSubscriptions = useSubscription(api.events.getTodaysEvents, [])
  const todaysEvents = computed(() => todaysEventsSubscriptions.response ?? [])

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