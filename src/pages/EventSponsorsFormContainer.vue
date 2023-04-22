<template>
  <div class="event-sponsors-form-container">
    <EventEditorSponsorsForm v-if="event" :event="event" />
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, watchEffect } from 'vue'
  import EventEditorSponsorsForm from '@/components/EventEditorSponsorsForm.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const api = useApi()
  const { set } = useNavigation()
  const eventId = useRouteParam('eventId')

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  watchEffect(() => {
    set({
      left: { title: 'Event', route: routes.event(eventId.value) },
    })
  })
</script>