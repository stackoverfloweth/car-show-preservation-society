<template>
  <div class="event-sponsors">
    <template v-if="advertisements.length">
      <PageHeader heading="Event Sponsors" />
      <div class="event-sponsors__content">
        <template v-for="advertisement in advertisements" :key="advertisement.advertisementId">
          <SponsorCard :advertisement="advertisement" />
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
  import SponsorCard from '@/components/SponsorCard.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'

  const props = defineProps<{
    event: Event,
  }>()

  const { event } = toRefs(props)
  const api = useApi()

  const advertisementsSubscription = useSubscription(api.advertisements.getAdvertisementsForEvent, [event.value.eventId])
  const advertisements = computed(() => advertisementsSubscription.response ?? [])
</script>

<style>
.event-sponsors__content {
  display: flex;
  gap: var(--space-md);
  justify-content: space-around;
  flex-wrap: wrap;
  overflow-y: auto;
  border-radius: var(--rounded);
  padding: var(--space-md);
}
</style>