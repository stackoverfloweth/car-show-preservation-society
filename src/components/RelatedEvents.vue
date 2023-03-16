<template>
  <div class="related-events">
    <template v-for="event in events" :key="event.eventId">
      <p-button inset class="related-events__event" @click="emit('open', event)">
        <div class="related-events__event-content">
          <SizedImage v-if="event.eventLogo" class="related-events__event-logo" :image="event.eventLogo" />
          <p class="related-events__event-name">
            {{ event.name }}
          </p>
          <div class="related-event__event-details">
            <p>{{ formatRelative(event.start, new Date()) }}</p>
            <p>{{ mocker.create('number', [1, 100]) }} miles away</p>
          </div>
        </div>
      </p-button>
    </template>
    <p-button inset class="related-events__event">
      <div class="related-events__event-content">
        <p class="related-events__event-name">
          Load More
          <p-icon icon="ChevronRightIcon" />
        </p>
      </div>
    </p-button>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { formatRelative } from 'date-fns'
  import { toRefs, computed } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'
  import { mocker } from '@/services'

  const props = defineProps<{
    eventId: string,
  }>()

  const emit = defineEmits<{
    (event: 'open', value: Event): void,
  }>()

  const { eventId } = toRefs(props)
  const api = useApi()

  const eventsSubscription = useSubscription(api.events.getRelatedEvents, [eventId])
  const events = computed(() => eventsSubscription.response ?? [])
</script>

<style>
.related-events {
  display: flex;
  border-radius: var(--rounded);
  gap: var(--space-4);
  overflow-y: auto;
}

.related-events__event {
  flex-shrink: 0;
}

.related-events__event-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-2);
  width: 240px;
}

.related-events__event-logo {
  width: 200px;
  height: 100px;
}

.related-events__event-name {
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 2.4em;
  line-height: 1.2em;
  display: flex;
  align-items: center;
}

.related-event__event-details {
  color: var(--slate-400);
  font-size: .75rem;
  line-height: 0.95rem;
  text-decoration: none !important;
}

.related-events__load-more {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>