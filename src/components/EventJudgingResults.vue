<template>
  <div class="event-judging-results">
    <template v-if="results.length">
      <template v-for="result in results" :key="result.votingCategoryId">
        <VotingResultsByCategoryItem v-bind="result" />
      </template>
    </template>
    <template v-else>
      <p-message info>
        <strong>Event results are not yet available!</strong>
        <p>Check back at a later time</p>
      </p-message>
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
  gap: var(--space-sm);
}
</style>