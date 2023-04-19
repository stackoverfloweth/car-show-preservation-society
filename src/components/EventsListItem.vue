<template>
  <p-list-item class="events-list-item">
    <EventHeader class="events-list-item__header" :event="event" />
    <p class="events-list-item__location">
      {{ event.location?.place }}
    </p>
  </p-list-item>
</template>

<script lang="ts" setup>
  import EventHeader from '@/components/EventHeader.vue'
  import { Event } from '@/models'

  defineProps<{
    event: Event,
  }>()
</script>

<style>
.events-list-item {
  display: grid;
  grid-template-areas:
    'header'
    'location';
  gap: var(--space-4);
}

.events-list-item__header {
  grid-area: header;
  pointer-events: none;
}

.events-list-item__location {
  grid-area: location;
  white-space: pre-line;
}
</style>