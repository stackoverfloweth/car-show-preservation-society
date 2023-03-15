<template>
  <div class="club-overview">
    <template v-if="club">
      <div class="club-overview__details">
        <SizedImage v-if="club.clubLogo" :src="club.clubLogo" class="club-overview__logo" />
        <span>{{ club.description }}</span>
        <ContactUserInfo :user-id="club.contactUserId" />
      </div>
      <div class="club-overview__events">
        <p-bread-crumbs :crumbs="[{ text: 'Upcoming Events' }]" />
        <EventsList :events="events" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, watchEffect } from 'vue'
  import ContactUserInfo from '@/components/ContactCard.vue'
  import EventsList from '@/components/EventsList.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi, useNavigationLeft, useNavigationTitle } from '@/compositions'
  import { routes } from '@/router/routes'

  const clubId = useRouteParam('clubId')
  const api = useApi()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  const club = computed(() => clubSubscription.response)

  const eventsSubscription = useSubscription(api.events.getEventsByClubId, [clubId])
  const events = computed(() => eventsSubscription.response ?? [])

  useNavigationLeft({ name: 'Clubs', route: routes.clubs() })

  watchEffect(() => {
    if (club.value?.name) {
      useNavigationTitle(club.value.name)
    }
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