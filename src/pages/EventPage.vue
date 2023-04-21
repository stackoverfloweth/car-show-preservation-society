<template>
  <template v-if="event">
    <EventManager
      v-if="canEditEvent && !isViewing"
      :event="event"
      @open:event="openRelatedEvent"
      @open:club="openRelatedClub"
    />
    <EventViewer
      v-else
      :event="event"
      @open:event="openRelatedEvent"
      @open:club="openRelatedClub"
    />
  </template>

  <p-modal v-model:show-modal="showEventModal" :title="relatedEvent?.name" auto-close>
    <template v-if="relatedEvent">
      <EventCard :event="relatedEvent" />
      <p-button :to="routes.event(relatedEvent.eventId)">
        Open Event
      </p-button>
    </template>
  </p-modal>

  <p-modal v-model:show-modal="showClubModal" :title="club?.name" auto-close>
    <template v-if="club">
      <ClubOverview :club="club" />
    </template>
  </p-modal>
</template>

<script lang="ts">
  export default {
    name: 'EventPage',
    expose: [],
    inheritAttrs: false,
  }
</script>

<script lang="ts" setup>
  import { BooleanRouteParam, useRouteParam, useRouteQueryParam, useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import ClubOverview from '@/components/ClubOverview.vue'
  import EventCard from '@/components/EventCard.vue'
  import EventManager from '@/components/EventManager.vue'
  import EventViewer from '@/components/EventViewer.vue'
  import { NavigationRecord, useApi, useCanEditEvent, useNavigation, useShowModal } from '@/compositions'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const eventId = useRouteParam('eventId')
  const api = useApi()
  const { set } = useNavigation()
  const isViewing = useRouteQueryParam('is-viewing', BooleanRouteParam, false)

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)
  const canEditEvent = useCanEditEvent()

  const clubSubscriptionDependencies = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionDependencies)
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