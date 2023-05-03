<template>
  <div class="event-judging-results">
    <template v-for="result in results" :key="result.votingCategory.votingCategoryId">
      <VotingResultsByCategoryItem v-bind="result" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import VotingResultsByCategoryItem from '@/components/VotingResultsByCategoryItem.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'

  const props = defineProps<{
    event: Event,
  }>()

  const api = useApi()
  const eventId = computed(() => props.event.eventId)

  const resultsSubscription = useSubscription(api.votingResults.getVotingResults, [eventId])
  const results = computed(() => resultsSubscription.response ?? [])
</script>

<style>
.event-judging-results {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>