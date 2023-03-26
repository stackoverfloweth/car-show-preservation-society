<template>
  <div class="events-list">
    <template v-for="event in events" :key="event.eventId">
      <router-link :to="routes.event(event.eventId)">
        <p-list-item class="events-list__event">
          <EventHeader class="events-list__event-header" :event="event" />
          <p class="events-list__event-location">
            {{ event.location?.place }}
          </p>
        </p-list-item>
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import EventHeader from '@/components/EventHeader.vue'
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

.events-list__event {
  display: grid;
  grid-template-areas:
    'header'
    'location';
    row-gap: var(--space-4);
}

.events-list__event-header {
  grid-area: header;
  pointer-events: none;
}

.events-list__event-location {
  grid-area: location;
  white-space: pre-line;
}
</style>