<template>
  <div class="voting-results-by-event-and-category-item">
    <ResultPlace :place="result.placeNumber" />
    <div class="voting-results-by-event-and-category-item__body">
      <div class="voting-results-by-event-and-category-item__event">
        {{ event.name }}
      </div>
      <div class="voting-results-by-event-and-category-item__category">
        {{ votingCategory.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ResultPlace from '@/components/ResultPlace.vue'
  import { Event, VotingCategory, VotingResult } from '@/models'

  defineProps<{
    event: Event,
    votingCategory: VotingCategory,
    result: VotingResult,
  }>()
</script>

<style>
.voting-results-by-event-and-category-item {
  background-color: var(--slate-800);
  padding: var(--space-4);
  border-radius: var(--rounded);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
</style>