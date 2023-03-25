<template>
  <div class="event-voting-summary">
    <template v-if="eventIsUpcoming">
      <EventVotingCategories :event-id="event.eventId" />
    </template>
    <template v-else>
      <EventVotingResults :event-id="event.eventId" />
      <EventPhotoGallery :event-id="event.eventId" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { isFuture } from 'date-fns'
  import { computed } from 'vue'
  import EventPhotoGallery from '@/components/EventPhotoGallery.vue'
  import EventVotingCategories from '@/components/EventVotingCategories.vue'
  import EventVotingResults from '@/components/EventVotingResults.vue'
  import { Event } from '@/models'


  const props = defineProps<{
    event: Event,
  }>()

  const eventIsUpcoming = computed(() => isFuture(props.event.end))
</script>

<style>

</style>