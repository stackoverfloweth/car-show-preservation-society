<template>
  <div class="events-list">
    <template v-for="event in events" :key="event.eventId">
      <router-link :to="routes.event(event.eventId)">
        <EventsListItem :event="event" class="events-list__item" />
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
  gap: var(--space-md);
}

.events-list__item:hover {
  background-color: var(--gray-700);
}
</style>