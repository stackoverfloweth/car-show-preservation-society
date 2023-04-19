<template>
  <div class="event-judging-summary">
    <template v-if="eventIsUpcoming">
      <JudgingCategoriesTable class="event-judging-summary__judging-categories" :categories="votingCategories" />
    </template>
    <template v-else>
      <EventJudgingResults :event="event" />
      <EventPhotoGallery :event-id="event.eventId" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { isFuture } from 'date-fns'
  import { computed, toRefs } from 'vue'
  import EventJudgingResults from '@/components/EventJudgingResults.vue'
  import EventPhotoGallery from '@/components/EventPhotoGallery.vue'
  import JudgingCategoriesTable from '@/components/JudgingCategoriesTable.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'

  const props = defineProps<{
    event: Event,
  }>()

  const { event } = toRefs(props)
  const api = useApi()
  const eventIsUpcoming = computed(() => isFuture(event.value.end))

  const votingCategoriesSubscription = useSubscription(api.votingCategories.getVotingCategories, [event.value.eventId])
  const votingCategories = computed(() => votingCategoriesSubscription.response ?? [])
</script>