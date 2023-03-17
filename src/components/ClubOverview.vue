<template>
  <div class="club-overview">
    <ClubCard :club-id="club.clubId" class="club-overview__details" />

    <div class="club-overview__events">
      <p-bread-crumbs :crumbs="[{ text: 'Upcoming Events' }]" />
      <EventsList :events="events" @row:click="navigateToEvent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import ClubCard from '@/components/ClubCard.vue'
  import EventsList from '@/components/EventsList.vue'
  import { useApi } from '@/compositions'
  import { Club, Event } from '@/models'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    club: Club,
  }>()

  const router = useRouter()
  const { club } = toRefs(props)
  const api = useApi()

  const eventsSubscription = useSubscription(api.events.getEventsByClubId, [club.value.clubId])
  const events = computed(() => eventsSubscription.response ?? [])

  function navigateToEvent({ row: event }: { row: Event }): void {
    router.push(routes.clubEvent(club.value.clubId, event.eventId))
  }
</script>

<style>
.club-overview {
  display: flex;
  padding: var(--space-4);
  gap: var(--space-4);
}

.club-overview__details {
  max-width: 40%;
}

.club-overview__events {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.club-overview__events {
  flex-grow: 1;
}

@media(max-width: 768px) {
  .club-overview {
    flex-direction: column;
  }

  .club-overview__details {
    max-width: unset;
  }
}
</style>