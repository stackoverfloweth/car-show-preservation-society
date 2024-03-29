<template>
  <div class="event-viewer">
    <EventHeader :event="event" class="event-viewer__header" @club:click="openRelatedClub">
      <template #actions>
        <template v-if="media.hover">
          <p-button inset icon="ShareIcon" />
          <template v-if="canRegister">
            <p-button :to="routes.eventRegister(event.eventId)">
              Register
            </p-button>
          </template>
          <template v-else-if="existingRegistration && !event.isPast">
            <router-link :to="routes.eventRegistration(event.eventId, existingRegistration.registrationId)">
              <p-button icon="QrCodeIcon" />
            </router-link>
          </template>
          <template v-if="isViewing">
            <p-button @click="isViewing = false">
              Manage
            </p-button>
          </template>
        </template>

        <template v-else>
          <p-icon-button-menu>
            <p-overflow-menu-item label="Share" icon="ShareIcon" />
            <template v-if="canRegister">
              <p-overflow-menu-item label="Register" icon="BookmarkIcon" :to="routes.eventRegister(event.eventId)" />
            </template>
            <template v-else-if="existingRegistration && !event.isPast">
              <p-overflow-menu-item label="View Registration" icon="BookmarkIcon" :to="routes.eventRegistration(event.eventId, existingRegistration.registrationId)" />
            </template>
            <template v-if="isViewing">
              <p-overflow-menu-item label="Manage" icon="CogIcon" @click="isViewing = false" />
            </template>
            <template v-if="existingRegistration && !event.isPast">
              <a href="#ballots">
                <p-overflow-menu-item label="View Ballots" icon="ClipboardDocumentCheckIcon" />
              </a>
            </template>
            <template v-if="event.isPast">
              <a href="#voting-results">
                <p-overflow-menu-item label="View Results" icon="ChartBarIcon" />
              </a>
            </template>
          </p-icon-button-menu>
        </template>
      </template>
    </EventHeader>

    <div class="event-viewer__columns">
      <div class="event-viewer__column">
        <SizedImage v-if="event.image" :image="event.image" class="event-viewer__logo" />
        <p>{{ event.description }}</p>

        <LocationCard v-if="event.location" class="event-viewer__location" :location="event.location" />

        <ContactIdCard class="event-viewer__contact" :user-id="event.contactUserId" show-label show-details />

        <template v-if="!event.isHappening">
          <EventSponsors class="event-viewer__sponsors" :event="event" />
        </template>
      </div>

      <div class="event-viewer__column">
        <template v-if="existingRegistration && !event.isPast">
          <EventBallots id="ballots" :event="event" />
        </template>
        <template v-else>
          <EventJudgingSummary id="voting-results" class="event-viewer__voting-summary" :event="event" />
        </template>
      </div>
    </div>

    <template v-if="!event.isHappening">
      <RelatedEvents :event-id="event.eventId" @open="openRelatedEvent" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { media } from '@prefecthq/prefect-design'
  import { BooleanRouteParam, useRouteQueryParam, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ContactIdCard from '@/components/ContactIdCard.vue'
  import EventBallots from '@/components/EventBallots.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import EventJudgingSummary from '@/components/EventJudgingSummary.vue'
  import EventSponsors from '@/components/EventSponsors.vue'
  import LocationCard from '@/components/LocationCard.vue'
  import RelatedEvents from '@/components/RelatedEvents.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'
  import { isLoggedIn } from '@/services/auth'

  const props = defineProps<{
    event: Event,
  }>()

  const emit = defineEmits<{
    (event: 'open:club', value: string): void,
    (event: 'open:event', value: Event): void,
  }>()

  const api = useApi()

  const isViewing = useRouteQueryParam('is-viewing', BooleanRouteParam, false)
  const eventId = computed(() => props.event.eventId)
  const registrationSubscriptionArgs = computed<Parameters<typeof api.registration.findCurrentUserRegistration> | null>(() => isLoggedIn() ? [eventId.value] : null)
  const registrationSubscription = useSubscriptionWithDependencies(api.registration.findCurrentUserRegistration, registrationSubscriptionArgs)
  const existingRegistration = computed(() => registrationSubscription.response)

  // also needs to check max-capacity
  const canRegister = computed(() => props.event.preregistrationOpen && !existingRegistration.value)

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
  padding: var(--space-md);
  padding-top: 0;
  gap: var(--space-lg);
}

.event-viewer__header {
  position: sticky;
  top: 0;
  margin-bottom: -32px;
  z-index: var(--z-front);
  padding: var(--space-md) 0;
  background-color: var(--gray-900);
}

.event-viewer__columns {
  --num-cols: 2;
  display: grid;
  grid-template-columns: repeat(var(--num-cols), minmax(0, 1fr));
  gap: var(--space-md);
}

.event-viewer__column {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg)
}

.event-viewer__voting-summary {
  position: absolute;
  overflow-y: auto;
  padding-bottom: var(--space-sm);
  top: 0;
  bottom: 0;
}

.event-viewer__logo {
  padding-top: 50%;
}

@media(max-width: 768px) {
  .event-viewer__columns {
    --num-cols:1;
  }

  .event-viewer__voting-summary {
    position: relative;
    max-height: 350px;
    overflow-y: auto;
  }
}
</style>