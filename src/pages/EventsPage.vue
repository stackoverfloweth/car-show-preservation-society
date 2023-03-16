<template>
  <div class="events-page">
    <EventsList :events="events" @row:click="navigateToEvent" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import EventsList from '@/components/EventsList.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'

  const router = useRouter()
  const api = useApi()
  const userId = '123'

  const eventsSubscription = useSubscription(api.events.getEventsByUserId, [userId])
  const events = computed(() => eventsSubscription.response ?? [])

  function navigateToEvent({ row: event }: { row: Event }): void {
    set({
      left: { title: 'Events', route: routes.events() },
    })

    router.push(routes.event(event.eventId))
  }

  const { set } = useNavigation({
    center: { title: 'Events' },
    right: { title: 'New', route: routes.eventsCreate() },
  })
</script>

<style>
.events-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
}

.events-page__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>