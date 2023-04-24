<template>
  <div class="event-judging-summary">
    <template v-if="event.isUpcoming">
      <JudgingCategoriesList :categories="votingCategories" />
    </template>
    <template v-else-if="event.isPast">
      <EventJudgingResults :event="event" />
      <EventPhotoGallery :event-id="event.eventId" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import EventJudgingResults from '@/components/EventJudgingResults.vue'
  import EventPhotoGallery from '@/components/EventPhotoGallery.vue'
  import JudgingCategoriesList from '@/components/JudgingCategoriesList.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'

  const props = defineProps<{
    event: Event,
  }>()

  const { event } = toRefs(props)
  const api = useApi()

  const votingCategoriesSubscription = useSubscription(api.votingCategories.getVotingCategories, [event.value.eventId])
  const votingCategories = computed(() => votingCategoriesSubscription.response ?? [])
</script>

<style>
.event-judging-summary {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>