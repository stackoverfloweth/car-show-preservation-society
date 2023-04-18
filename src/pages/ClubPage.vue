<template>
  <div class="club-page">
    <ClubViewer v-if="club" :club="club" :events="events" />
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import ClubViewer from '@/components/ClubViewer.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const clubId = useRouteParam('clubId')
  const api = useApi()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  const club = computed(() => clubSubscription.response)

  const eventSubscriptionArgs = computed<Parameters<typeof api.events.getEventsByClubId> | null>(() => club.value ? [club.value.clubId] : null)
  const eventsSubscription = useSubscriptionWithDependencies(api.events.getEventsByClubId, eventSubscriptionArgs)
  const events = computed(() => eventsSubscription.response ?? [])

  useNavigation({
    left: route.name === 'clubs.view' ? { title: 'Clubs', route: routes.clubs() } : undefined,
  })
</script>

<style>
.club-page {
  padding: var(--space-4);
}
</style>