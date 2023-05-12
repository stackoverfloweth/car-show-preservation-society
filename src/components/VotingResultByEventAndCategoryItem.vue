<template>
  <div class="voting-result-by-event-and-category-item">
    <ResultPlace :place="result.placeNumber" />
    <div class="voting-result-by-event-and-category-item__body">
      <div class="voting-result-by-event-and-category-item__event">
        {{ event.name }}
      </div>
      <div class="voting-result-by-event-and-category-item__category">
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
.voting-result-by-event-and-category-item {
  background-color: var(--gray-800);
  padding: var(--space-md);
  border-radius: var(--rounded);
  display: flex;
  align-items: center;
  gap: var(--space-md);
}
</style>