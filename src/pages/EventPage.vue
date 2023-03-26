<template>
  <EventViewer
    v-if="event"
    :event="event"
    @open:event="openRelatedEvent"
    @open:club="openRelatedClub"
  />

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
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import ClubOverview from '@/components/ClubOverview.vue'
  import EventCard from '@/components/EventCard.vue'
  import EventViewer from '@/components/EventViewer.vue'
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