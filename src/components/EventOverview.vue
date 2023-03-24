<template>
  <div class="event-overview">
    <SizedImage v-if="event.eventLogo" :image="event.eventLogo" class="event-overview__logo" />

    <span>{{ event.description }}</span>

    <ContactCard :user-id="event.contactUserId" />

    <div class="event-overview__event-advertisements">
      <template v-for="advertisement in advertisements" :key="advertisement.advertisementId">
        <SponsorCard class="event-overview__event-advertisement" :advertisement="advertisement" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import ContactCard from '@/components/ContactCard.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import SponsorCard from '@/components/SponsorCard.vue'
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

  const advertisementsSubscription = useSubscription(api.advertisements.getAdvertisementsForEvent, [event.value.eventId])
  const advertisements = computed(() => advertisementsSubscription.response ?? [])
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