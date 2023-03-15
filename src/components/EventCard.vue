<template>
  <div class="event-card">
    <EventHeading :event-id="eventId" />
    <SizedImage v-if="event?.eventLogo" :image="event.eventLogo" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import EventHeading from '@/components/EventHeading.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    eventId: string,
  }>()

  const { eventId } = toRefs(props)
  const api = useApi()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)
</script>