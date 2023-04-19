<template>
  <div class="events-list">
    <template v-for="event in events" :key="event.eventId">
      <router-link :to="routes.event(event.eventId)">
        <EventsListItem :event="event" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import EventsListItem from '@/components/EventsListItem.vue'
  import { Event } from '@/models/event'
  import { routes } from '@/router/routes'

  defineProps<{
    events: Event[],
  }>()
</script>

<style>
.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>