<template>
  <div class="club-overview">
    <div class="club-overview__details">
      <SizedImage v-if="club.clubLogo" :image="club.clubLogo" class="club-overview__logo" />
      <p-bread-crumbs :crumbs="[{ text: club.name }]" />
      <span>{{ club.description }}</span>
      <ContactUserInfo :user-id="club.contactUserId" />
    </div>

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
  import ContactUserInfo from '@/components/ContactCard.vue'
  import EventsList from '@/components/EventsList.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi, useNavigation } from '@/compositions'
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
    set({
      left: { title: club.value.name, route: routes.club(club.value.clubId) },
    })

    router.push(routes.event(event.eventId))
  }

  const { set } = useNavigation({
    left: { title: 'Clubs', route: routes.clubs() },
  })
</script>

<style>
.club-overview {
  display: flex;
  padding: var(--space-4);
  gap: var(--space-4);
}

.club-overview__details {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 40%;
}

.club-overview__events {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.club-overview__logo {
  height: 140px;
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