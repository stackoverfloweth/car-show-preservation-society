<template>
  <div class="event-overview">
    <SizedImage v-if="event.eventLogo" :image="event.eventLogo" class="event-overview__logo" />

    <span>{{ event.description }}</span>

    <ContactUserInfo :user-id="event.contactUserId" />

    <div class="event-overview__event-advertisements">
      <template v-for="index in 7" :key="index">
        <EventAdvertisement class="event-overview__event-advertisement" :event-id="event.eventId" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import ContactUserInfo from '@/components/ContactCard.vue'
  import EventAdvertisement from '@/components/EventAdvertisement.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'

  const props = defineProps<{
    event: Event,
  }>()

  const { event } = toRefs(props)
  const api = useApi()

  const clubSubscriptionArgs = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value.clubId ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionArgs)
  const club = computed(() => clubSubscription.response)
</script>

<style>
.event-overview {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.event-overview__logo {
  height: 140px;
}

.event-overview__event-advertisements {
  display: flex;
  gap: var(--space-4);
  justify-content: space-around;
  flex-wrap: wrap;
  overflow-y: auto;
}

.event-overview__event-advertisement {
  width: 120px;
  height: 120px;
}
</style>