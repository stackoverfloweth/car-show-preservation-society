<template>
  <div class="event-overview">
    <template v-if="event">
      <div class="event-overview__header">
        <EventHeading class="event-overview__club-card" :event-id="event.eventId" />

        <div class="event-overview__header-actions">
          <p-button inset icon="ShareIcon" />
          <template v-if="eventIsUpcoming">
            <p-button>Register</p-button>
          </template>
        </div>
      </div>

      <div class="event-overview__content">
        <div class="event-overview__details">
          <SizedImage v-if="event.eventLogo" :image="event.eventLogo" class="event-overview__logo" />

          <span>{{ event.description }}</span>

          <ContactUserInfo :user-id="event.contactUserId" />

          <div class="event-overview__event-advertisements">
            <template v-for="index in 7" :key="index">
              <EventAdvertisement class="event-overview__event-advertisement" :event-id="eventId" />
            </template>
          </div>
        </div>

        <div class="event-overview__voting-summary">
          <template v-if="eventIsUpcoming">
            <EventVotingCategories :event-id="eventId" />
          </template>
          <template v-else>
            <EventVotingResults :event-id="eventId" />
            <EventPhotoGallery :event-id="eventId" />
          </template>
        </div>
      </div>

      <div class="event-overview__related-events">
        <RelatedEvents :event-id="eventId" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { isFuture } from 'date-fns'
  import { computed } from 'vue'
  import ContactUserInfo from '@/components/ContactCard.vue'
  import EventAdvertisement from '@/components/EventAdvertisement.vue'
  import EventHeading from '@/components/EventHeading.vue'
  import EventPhotoGallery from '@/components/EventPhotoGallery.vue'
  import EventVotingCategories from '@/components/EventVotingCategories.vue'
  import EventVotingResults from '@/components/EventVotingResults.vue'
  import RelatedEvents from '@/components/RelatedEvents.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const eventId = useRouteParam('eventId')
  const api = useApi()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const clubSubscriptionArgs = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value?.clubId ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionArgs)
  const club = computed(() => clubSubscription.response)

  const eventIsUpcoming = computed(() => !event.value?.end || isFuture(event.value.end))

  useNavigation({ name: 'Events', route: routes.events() })
</script>

<style>
.event-overview {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-6);
}

.event-overview__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-2);
}

.event-overview__club-card {
  flex-grow: 1;
}

.event-overview__header-actions {
  display: flex;
  gap: var(--space-3);
}

.event-overview__content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.event-overview__details {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  gap: var(--space-4);
}

.event-overview__logo {
  height: 140px;
}

.event-overview__event-advertisements {
  display: flex;
  gap: var(--space-4);
  justify-content: space-around;
  flex-wrap: wrap;
  overflow-y: auto;
}

.event-overview__event-advertisement {
  width: 120px;
  height: 120px;
}

@media(max-width: 768px) {
  .club-overview__details {
    max-width: unset;
  }
}
</style>