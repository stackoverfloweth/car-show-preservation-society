<template>
  <div class="today-view-page">
    <template v-if="todaysEvents.length">
      <div class="today-view-page__todays-events">
        <p-bread-crumbs :crumbs="[{ text: 'Happening Now' }]" />
        <template v-for="event in todaysEvents" :key="event.eventId">
          <EventCard :event-id="event.eventId" />
        </template>
      </div>
    </template>

    <div class="today-view-page__upcoming-events">
      <p-bread-crumbs :crumbs="[{ text: 'Upcoming Events' }]" />
      <EventsList :events="upcomingEvents" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventCard from '@/components/EventCard.vue'
  import EventsList from '@/components/EventsList.vue'
  import { useApi } from '@/compositions'

  const api = useApi()

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