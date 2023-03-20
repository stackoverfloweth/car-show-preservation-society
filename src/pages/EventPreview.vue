<template>
  <template v-if="event">
    <EventOverview :event="event" />
  </template>
  <div class="event-preview" />
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventOverview from '@/components/EventOverview.vue'
  import { useApi } from '@/compositions'

  const api = useApi()
  const eventId = useRouteParam('eventId')

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)
</script>