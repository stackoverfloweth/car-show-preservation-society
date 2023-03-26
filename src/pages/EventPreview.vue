<template>
  <div class="event-preview">
    <template v-if="event">
      <div class="event-preview__overlay" />
      <EventViewer v-if="event" :event="event" class="event-preview__event-page" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref, watchEffect } from 'vue'
  import EventViewer from '@/components/EventViewer.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const api = useApi()
  const { set } = useNavigation()
  const eventId = useRouteParam('eventId')

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const pending = ref(false)

  async function toggleDraft(): Promise<void> {
    pending.value = true

    if (!event.value) {
      return
    }

    const { isDraft } = event.value
    await api.events.updateEvent({ ...event.value, isDraft: !isDraft })

    await eventSubscription.refresh()
    pending.value = false
  }

  watchEffect(() => {
    set({
      left: { title: 'Events', route: routes.events() },
      right: { title: event.value?.isDraft ? 'Publish' : 'Revert to draft', pending: pending.value, callback: toggleDraft },
    })
  })
</script>

<style>
.event-preview {
  position: relative;
}

.event-preview__overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: var(--z-overlay);
}

.event-preview__event-page{
  pointer-events: none;
}
</style>