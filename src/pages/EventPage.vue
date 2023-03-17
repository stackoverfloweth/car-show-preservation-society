<template>
  <div class="event-page">
    <template v-if="event">
      <EventHeader :event="event" class="event-overview__header" @club-click="openRelatedClub" />

      <div class="event-page__overview">
        <EventOverview :event="event" />

        <div class="event-page__voting-summary">
          <template v-if="eventIsUpcoming">
            <EventVotingCategories :event-id="event.eventId" />
          </template>
          <template v-else>
            <EventVotingResults :event-id="event.eventId" />
            <EventPhotoGallery :event-id="event.eventId" />
          </template>
        </div>
      </div>
    </template>

    <div class="event-overview__related-events">
      <RelatedEvents v-if="event" :event-id="event.eventId" @open="openRelatedEvent" />
    </div>

    <p-modal v-model:show-modal="showEventModal" auto-close>
      <EventOverview v-if="relatedEvent" :event="relatedEvent" />
    </p-modal>

    <p-modal v-model:show-modal="showClubModal" auto-close>
      <ClubCard v-if="event?.clubId" :club-id="event.clubId" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { isFuture } from 'date-fns'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import ClubCard from '@/components/ClubCard.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import EventOverview from '@/components/EventOverview.vue'
  import EventPhotoGallery from '@/components/EventPhotoGallery.vue'
  import EventVotingCategories from '@/components/EventVotingCategories.vue'
  import EventVotingResults from '@/components/EventVotingResults.vue'
  import RelatedEvents from '@/components/RelatedEvents.vue'
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

  const eventIsUpcoming = computed(() => !event.value || isFuture(event.value.end))

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
    console.log(route.name)
    if (route.name === 'events.view') {
      return { title: 'Events', route: routes.events() }
    }

    if (route.name === 'clubs.event' && club.value) {
      return { title: club.value.name, route: routes.club(club.value.clubId) }
    }

    return undefined
  })

  watch(navigationRecord, left => {
    console.log({ left })
    set({ left })
  }, { immediate: true })
</script>

<style>
.event-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
}

.event-page__overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

@media(max-width: 768px) {
  .event-page__overview {
    grid-template-columns: 1fr;
  }
}
</style>