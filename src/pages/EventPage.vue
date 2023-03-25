<template>
  <div class="event-page" v-bind="$attrs">
    <template v-if="event">
      <EventHeader :event="event" class="event-overview__header" @club-click="openRelatedClub" />

      <div class="event-page__overview">
        <SizedImage v-if="event.eventLogo" :image="event.eventLogo" class="event-page__logo" />
        <p>{{ event.description }}</p>
      </div>

      <ContactCard class="event-page__contact" :user-id="event.contactUserId" />

      <EventSponsors :event="event" />

      <EventVotingSummary class="event-page__voting-summary" :event="event" />

      <div class="event-overview__related-events">
        <p-bread-crumbs :crumbs="[{ text: 'Similar Events' }]" />
        <RelatedEvents :event-id="event.eventId" @open="openRelatedEvent" />
      </div>
    </template>
  </div>

  <template v-if="relatedEvent">
    <p-modal v-model:show-modal="showEventModal" :title="relatedEvent.name" auto-close>
      <EventCard :event="relatedEvent" />
      <p-button :to="routes.event(relatedEvent.eventId)">
        Open Event
      </p-button>
    </p-modal>
  </template>

  <template v-if="club">
    <p-modal v-model:show-modal="showClubModal" :title="club.name" auto-close>
      <ClubOverview :club="club" />
    </p-modal>
  </template>
</template>

<script lang="ts">
  export default {
    name: 'EventPage',
    expose: [],
    inheritAttrs: false,
  }
</script>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import ClubOverview from '@/components/ClubOverview.vue'
  import ContactCard from '@/components/ContactCard.vue'
  import EventCard from '@/components/EventCard.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import EventSponsors from '@/components/EventSponsors.vue'
  import EventVotingSummary from '@/components/EventVotingSummary.vue'
  import RelatedEvents from '@/components/RelatedEvents.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { NavigationRecord, useApi, useNavigation, useShowModal } from '@/compositions'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const clubId = useRouteParam('clubId')
  const eventId = useRouteParam('eventId')
  const api = useApi()
  const { set } = useNavigation()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  const club = computed(() => clubSubscription.response)

  const showEventModal = computed({
    get() {
      return relatedEvent.value !== undefined
    },
    set(value) {
      if (!value) {
        relatedEvent.value = undefined
      }
    },
  })

  const relatedEvent = ref<Event>()

  function openRelatedEvent(event: Event): void {
    relatedEvent.value = event
  }

  const { showModal: showClubModal, open: openRelatedClub } = useShowModal()

  const navigationRecord = computed<Partial<NavigationRecord> | undefined>(() => {
    if (route.name === 'events.view') {
      return { title: 'Events', route: routes.events() }
    }

    if (route.name === 'clubs.event' && club.value) {
      return { title: club.value.name, route: routes.club(club.value.clubId) }
    }

    return undefined
  })

  watch(navigationRecord, left => {
    set({ left })
  }, { immediate: true })
</script>

<style>
.event-page {
  display: grid;
  padding: var(--space-4);
  padding-top: 0;
  grid-template-areas:
    'header header'
    'overview voting-summary'
    'contact voting-summary'
    'sponsors voting-summary'
    'related-events related-events';
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.event-overview__header {
  grid-area: header;
  position: sticky;
  top: 0;
  margin-bottom: -34px;
  z-index: var(--z-front);
  padding: var(--space-4) 0;
  background-color: var(--slate-900);
}

.event-page__overview {
  grid-area: overview;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.event-page__contact {
  grid-area: contact;
}

.event-page__voting-summary {
  grid-area: voting-summary;
}

.event-overview__related-events {
  grid-area: related-events;
}

.event-page__logo {
  height: 200px;
}

@media(max-width: 768px) {
  .event-page {
    display: grid;
    padding: var(--space-4);
    padding-top: 0;
    grid-template-areas:
      'header'
      'overview'
      'contact'
      'voting-summary'
      'sponsors'
      'related-events';
    grid-template-columns: 100%;
  }
}
</style>