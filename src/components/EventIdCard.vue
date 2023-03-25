<template>
  <EventCard v-if="event" :event="event" />
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import EventCard from '@/components/EventCard.vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    eventId: string,
  }>()

  const { eventId } = toRefs(props)
  const api = useApi()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)
</script>