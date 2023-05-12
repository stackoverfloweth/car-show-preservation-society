<template>
  <div v-if="events.length" class="related-events">
    <PageHeader heading="Similar Events" />
    <div class="related-events__events">
      <template v-for="event in events" :key="event.eventId">
        <p-button inset class="related-events__event" @click="emit('open', event)">
          <div class="related-events__event-content">
            <SizedImage v-if="event.image" class="related-events__event-logo" :image="event.image" />
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
    </div>
    <!--
      <p-button inset class="related-events__event">
      <div class="related-events__event-content">
      <p class="related-events__event-name">
      Load More
      <p-icon icon="ChevronRightIcon" />
      </p>
      </div>
      </p-button>
    -->
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { formatRelative } from 'date-fns'
  import { toRefs, computed } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
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
.related-events__events {
  display: flex;
  border-radius: var(--rounded);
  gap: var(--space-md);
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
  gap: var(--space-sm);
  width: 240px;
}

.related-events__event-logo {
  width: 100%;
  padding-top: 50%;
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
  color: var(--gray-400);
  font-size: var(--text-xs);
  line-height: 0.95rem;
  text-decoration: none !important;
}

.related-events__load-more {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>