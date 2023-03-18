<template>
  <div class="club-page">
    <template v-if="club">
      <div class="club-page__overview">
        <ClubOverview :club="club" />

        <div class="club-overview__events">
          <p-bread-crumbs :crumbs="[{ text: 'Upcoming Events' }]" />
          <EventsList :events="events" @row:click="navigateToEvent" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import ClubOverview from '@/components/ClubOverview.vue'
  import EventsList from '@/components/EventsList.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const router = useRouter()
  const clubId = useRouteParam('clubId')
  const api = useApi()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  const club = computed(() => clubSubscription.response)

  const eventSubscriptionArgs = computed<Parameters<typeof api.events.getEventsByClubId> | null>(() => club.value ? [club.value.clubId] : null)
  const eventsSubscription = useSubscriptionWithDependencies(api.events.getEventsByClubId, eventSubscriptionArgs)
  const events = computed(() => eventsSubscription.response ?? [])

  function navigateToEvent({ row: event }: { row: Event }): void {
    if (club.value) {
      router.push(routes.clubEvent(club.value.clubId, event.eventId))
    }
  }

  useNavigation({
    left: route.name === 'clubs.view' ? { title: 'Clubs', route: routes.clubs() } : undefined,
  })
</script>

<style>
.club-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
}

.club-page__overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

@media(max-width: 768px) {
  .club-page__overview {
    grid-template-columns: 1fr;
  }
}
</style>