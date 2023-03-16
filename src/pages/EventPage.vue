<template>
  <div class="event-page">
    <EventOverview v-if="event" :event="event" />

    <div class="event-overview__related-events">
      <RelatedEvents v-if="event" :event-id="event.eventId" @open="openRelatedEvent" />
    </div>

    <p-modal v-model:show-modal="showModal">
      <EventOverview v-if="relatedEvent" :event="relatedEvent" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import EventOverview from '@/components/EventOverview.vue'
  import RelatedEvents from '@/components/RelatedEvents.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'

  const eventId = useRouteParam('eventId')
  const api = useApi()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const showModal = computed({
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
</script>