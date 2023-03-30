<template>
  <div class="events-page">
    <EventsList :events="events" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventsList from '@/components/EventsList.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const api = useApi()
  const userId = '123'

  const eventsSubscription = useSubscription(api.events.getEventsByUserId, [userId])
  const events = computed(() => eventsSubscription.response ?? [])

  useNavigation({
    center: { title: 'Events' },
    right: { title: 'New', route: routes.eventCreate() },
  })
</script>

<style>
.events-page {
  padding: var(--space-4);
}
</style>