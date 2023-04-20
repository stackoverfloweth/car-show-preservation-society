<template>
  <div class="event-viewer">
    <EventHeader :event="event" class="event-viewer__header" @club:click="openRelatedClub">
      <template #actions>
        <template v-if="canEditEvent">
          <p-icon-button-menu>
            <p-overflow-menu-item label="Share" icon="ShareIcon" />
            <template v-if="canRegister">
              <p-overflow-menu-item label="Register" icon="BookmarkIcon" :to="routes.eventRegistration(event.eventId)" />
            </template>
            <p-overflow-menu-item label="Edit" icon="PencilIcon" :to="routes.eventEditor(event.eventId)" />
          </p-icon-button-menu>
        </template>

        <template v-else-if="media.hover">
          <template v-if="!canEditEvent">
            <p-button inset icon="ShareIcon" />
          </template>
          <template v-if="canRegister">
            <p-button :to="routes.eventRegistration(event.eventId)">
              Register
            </p-button>
          </template>
        </template>

        <template v-else>
          <p-icon-button-menu>
            <p-overflow-menu-item label="Share" icon="ShareIcon" />
            <template v-if="canRegister">
              <p-overflow-menu-item label="Register" icon="BookmarkIcon" :to="routes.eventRegistration(event.eventId)" />
            </template>
          </p-icon-button-menu>
        </template>
      </template>
    </EventHeader>

    <div class="event-viewer__columns">
      <div class="event-viewer__column">
        <SizedImage v-if="event.eventLogo" :image="event.eventLogo" class="event-viewer__logo" />
        <p>{{ event.description }}</p>

        <LocationCard class="event-viewer__location" :location="event.location" />

        <ContactIdCard class="event-viewer__contact" :user-id="event.contactUserId" show-label show-details />

        <EventSponsors class="event-viewer__sponsors" :event="event" />
      </div>

      <div class="event-viewer__column">
        <EventJudgingSummary class="event-viewer__voting-summary" :event="event" />
      </div>
    </div>

    <div class="event-viewer__related-events">
      <p-bread-crumbs :crumbs="[{ text: 'Similar Events' }]" />
      <RelatedEvents :event-id="event.eventId" @open="openRelatedEvent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { media } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { isFuture } from 'date-fns'
  import { computed } from 'vue'
  import ContactIdCard from '@/components/ContactIdCard.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import EventJudgingSummary from '@/components/EventJudgingSummary.vue'
  import EventSponsors from '@/components/EventSponsors.vue'
  import LocationCard from '@/components/LocationCard.vue'
  import RelatedEvents from '@/components/RelatedEvents.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi, useCanEditEvent } from '@/compositions'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    event: Event,
  }>()

  const emit = defineEmits<{
    (event: 'open:club', value: string): void,
    (event: 'open:event', value: Event): void,
  }>()

  const canEditEvent = useCanEditEvent()
  const api = useApi()

  const eventId = computed(() => props.event.eventId)
  const eventIsUpcoming = computed(() => isFuture(props.event.end))
  const registrationSubscription = useSubscription(api.registration.findRegistration, [eventId, currentUser.userId])
  const alreadyRegistered = computed(() => !!registrationSubscription.response)
  const canRegister = computed(() => eventIsUpcoming.value && !alreadyRegistered.value && props.event.preRegistration)

  function openRelatedEvent(event: Event): void {
    emit('open:event', event)
  }

  function openRelatedClub(clubId: string): void {
    emit('open:club', clubId)
  }
</script>

<style>
.event-viewer {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  padding-top: 0;
  gap: var(--space-5);
}

.event-viewer__header {
  grid-area: header;
  position: sticky;
  top: 0;
  margin-bottom: -34px;
  z-index: var(--z-front);
  padding: var(--space-4) 0;
  background-color: var(--slate-900);
}

.event-viewer__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.event-viewer__column {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-5)
}

.event-viewer__voting-summary {
  position: absolute;
  overflow-y: auto;
  top: 0;
  bottom: 0;
}

.event-viewer__logo {
  padding-top: 50%;
}

@media(max-width: 768px) {

}
</style>