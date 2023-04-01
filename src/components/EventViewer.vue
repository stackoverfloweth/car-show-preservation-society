<template>
  <div class="event-viewer">
    <EventHeader :event="event" class="event-overview__header" @club:click="openRelatedClub">
      <template #actions>
        <template v-if="canEditEvent">
          <p-icon-button-menu>
            <p-overflow-menu-item label="Share" icon="ShareIcon" />
            <template v-if="eventIsUpcoming">
              <p-overflow-menu-item label="Register" icon="BookmarkIcon" />
            </template>
            <p-overflow-menu-item label="Edit" icon="PencilIcon" :to="routes.eventEditor(event.eventId)" />
          </p-icon-button-menu>
        </template>

        <template v-else-if="media.hover">
          <template v-if="!canEditEvent">
            <p-button inset icon="ShareIcon" />
          </template>
          <template v-if="eventIsUpcoming">
            <p-button>Register</p-button>
          </template>
        </template>

        <template v-else>
          <p-icon-button-menu>
            <p-overflow-menu-item label="Share" icon="ShareIcon" />
            <template v-if="eventIsUpcoming">
              <p-overflow-menu-item label="Register" icon="BookmarkIcon" />
            </template>
          </p-icon-button-menu>
        </template>
      </template>
    </EventHeader>

    <div class="event-viewer__overview">
      <SizedImage v-if="event.eventLogo" :image="event.eventLogo" class="event-viewer__logo" />
      <p>{{ event.description }}</p>
    </div>

    <LocationCard class="event-viewer__location" :location="event.location" />

    <ContactCard class="event-viewer__contact" :user-id="event.contactUserId" />

    <EventSponsors class="event-viewer__sponsors" :event="event" />

    <EventJudgingSummary class="event-viewer__voting-summary" :event="event" />

    <div class="event-viewer__related-events">
      <p-bread-crumbs :crumbs="[{ text: 'Similar Events' }]" />
      <RelatedEvents :event-id="event.eventId" @open="openRelatedEvent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { media } from '@prefecthq/prefect-design'
  import { isFuture } from 'date-fns'
  import { computed } from 'vue'
  import ContactCard from '@/components/ContactCard.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import EventJudgingSummary from '@/components/EventJudgingSummary.vue'
  import EventSponsors from '@/components/EventSponsors.vue'
  import LocationCard from '@/components/LocationCard.vue'
  import RelatedEvents from '@/components/RelatedEvents.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    event: Event,
  }>()

  const emit = defineEmits<{
    (event: 'open:club', value: string): void,
    (event: 'open:event', value: Event): void,
  }>()

  const eventIsUpcoming = computed(() => isFuture(props.event.end))
  const canEditEvent = false

  function openRelatedEvent(event: Event): void {
    emit('open:event', event)
  }

  function openRelatedClub(clubId: string): void {
    emit('open:club', clubId)
  }
</script>

<style>
.event-viewer {
  display: grid;
  padding: var(--space-4);
  padding-top: 0;
  grid-template-areas:
    'header header header header'
    'overview overview voting-summary voting-summary'
    'location contact voting-summary voting-summary'
    'sponsors sponsors voting-summary voting-summary'
    'related-events related-events related-events related-events';
  grid-template-columns: repeat(4, minmax(0, 1fr));
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

.event-viewer__overview {
  grid-area: overview;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.event-viewer__location {
  grid-area: location;
}

.event-viewer__contact {
  grid-area: contact;
}

.event-viewer__sponsors {
  grid-area: sponsors;
}

.event-viewer__voting-summary {
  grid-area: voting-summary;
  position: relative;
}

.event-viewer__related-events {
  grid-area: related-events;
}

.event-viewer__logo {
  height: 200px;
}

@media(max-width: 768px) {
  .event-viewer {
    display: grid;
    padding: var(--space-4);
    padding-top: 0;
    grid-template-areas:
      'header'
      'overview'
      'location'
      'contact'
      'voting-summary'
      'sponsors'
      'related-events';
    grid-template-columns: 100%;
  }
}
</style>