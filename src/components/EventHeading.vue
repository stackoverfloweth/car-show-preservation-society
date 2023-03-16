<template>
  <div class="event-heading">
    <template v-if="event">
      <p-link :to="routes.club(event?.clubId)" class="event-heading__club-name">
        {{ club?.name }}
      </p-link>
    </template>

    <p-bread-crumbs v-if="event" :crumbs="[{ text: event.name }]" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import { useApi } from '@/compositions'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    eventId: string,
  }>()

  const { eventId } = toRefs(props)
  const api = useApi()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const clubSubscriptionArgs = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value?.clubId ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionArgs)
  const club = computed(() => clubSubscription.response)
</script>

<style>
.event-heading {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.event-heading__logo {
  flex-grow: 1;
  height: 100%;
  max-width: 80px;
}

.event-heading__event-name {
  font-size: 1.25rem;
}
</style>