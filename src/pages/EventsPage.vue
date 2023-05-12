<template>
  <div class="events-page">
    <EventsFilterComponent v-model:filter="filter" v-model:sort="sort" />
    <EventsList :events="events" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import EventsFilterComponent from '@/components/EventsFilter.vue'
  import EventsList from '@/components/EventsList.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { EventsFilter } from '@/models/api/eventsFilter'
  import { EventsSort } from '@/models/api/eventsSort'
  import { routes } from '@/router/routes'

  const api = useApi()

  const filter = ref<EventsFilter>({})
  const sort = ref<EventsSort>({
    sort: 'date',
    order: 'desc',
  })

  const eventsSubscription = useSubscription(api.events.getEvents, [filter, sort])
  const events = computed(() => eventsSubscription.response ?? [])

  useNavigation({
    center: { title: 'Events' },
    right: { title: 'New', route: routes.eventCreate() },
  })
</script>

<style>
.events-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md);
}
</style>