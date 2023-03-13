<template>
  <div class="event-overview">
    <template v-if="event">
      <ClubCard class="event-overview__club-card" :club-id="event.clubId" />

      <div class="event-overview__details">
        <SizedImage v-if="event.eventLogo" :src="event.eventLogo" class="event-overview__logo" />
        <span>{{ event.description }}</span>
        <ContactUserInfo :user-id="event.contactUserId" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, watchEffect } from 'vue'
  import ClubCard from '@/components/ClubCard.vue'
  import ContactUserInfo from '@/components/ContactCard.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi, useNavigationLeft, useNavigationTitle } from '@/compositions'
  import { routes } from '@/router/routes'

  const eventId = useRouteParam('eventId')
  const api = useApi()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const clubSubscriptionArgs = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value?.clubId ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionArgs)
  const club = computed(() => clubSubscription.response)

  useNavigationLeft({ name: 'Events', route: routes.events() })

  watchEffect(() => {
    if (event.value?.name) {
      useNavigationTitle(event.value.name)
    }
  })
</script>

<style>
.event-overview {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
}

.event-overview__details {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.event-overview__logo {
  height: 140px;
}

.event-overview__events {
  flex-grow: 1;
}
</style>