<template>
  <p-list-item class="events-list-item">
    <SizedImage class="events-list-item__image" :image="event.eventLogo" />
    <EventHeader class="events-list-item__header" :event="event" />
    <p class="events-list-item__location">
      {{ event.location?.place }}
    </p>
  </p-list-item>
</template>

<script lang="ts" setup>
  import EventHeader from '@/components/EventHeader.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { Event } from '@/models'

  defineProps<{
    event: Event,
  }>()
</script>

<style>
.events-list-item {
  display: grid;
  grid-template-areas:
    'image header'
    'image location';
  gap: var(--space-4);
  grid-template-columns: 200px 1fr;
}

.events-list-item__image {
  grid-area: image;
  width: 100%;
  padding-top: 50%;
}

.events-list-item__header {
  grid-area: header;
  pointer-events: none;
}

.events-list-item__location {
  grid-area: location;
  white-space: pre-line;
}

@media(max-width: 768px){
  .events-list-item {
    grid-template-areas:
      'header'
      'image'
      'location';
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>