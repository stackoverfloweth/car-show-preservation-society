<template>
  <div class="event-preview">
    <template v-if="event">
      <div class="event-preview__publish">
        <template v-if="event.isDraft">
          <p>Event is still in draft status</p>
          <p-button @click="toggleDraft">
            Publish
          </p-button>
        </template>
        <template v-else>
          <p>Event is live</p>
          <p-button danger @click="toggleDraft">
            Revert to draft
          </p-button>
        </template>
      </div>
      <EventPage class="event-preview__event-page" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useApi } from '@/compositions'
  import EventPage from '@/pages/EventPage.vue'

  const api = useApi()
  const eventId = useRouteParam('eventId')

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  async function toggleDraft(): Promise<void> {
    if (!event.value) {
      return
    }

    const { isDraft } = event.value
    await api.events.updateEvent({ ...event.value, isDraft: !isDraft })

    eventSubscription.refresh()
  }
</script>

<style>
.event-preview {
  border: 3px solid var(--slate-800);
}

.event-preview__publish {
  padding: var(--space-3);
  border-bottom: 3px solid var(--slate-800);
  background-color: var(--slate-800);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-preview__event-page{
  pointer-events: none;
}
</style>