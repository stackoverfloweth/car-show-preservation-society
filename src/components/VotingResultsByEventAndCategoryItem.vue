<template>
  <div class="voting-results-by-event-and-category-item">
    <div class="voting-results-by-event-and-category-item__place" :class="classes">
      <p class="voting-results-by-event-and-category-item__place-number">
        <span>{{ result.placeNumber }}</span>
        <sup class="voting-results-by-event-and-category-item__place-ordinal">{{ getOrdinal(result.placeNumber) }}</sup>
      </p>
      <component :is="trophy" class="voting-results-by-event-and-category-item__trophy" />
    </div>
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
  import { computed } from 'vue'
  import trophy from '@/icons/trophy.svg'
  import { Event, VotingCategory, VotingResult } from '@/models'
  import { getOrdinal } from '@/utilities'

  const props = defineProps<{
    event: Event,
    votingCategory: VotingCategory,
    result: VotingResult,
  }>()

  const classes = computed(() => [`voting-results-by-event-and-category-item--place-${props.result.placeNumber}`])
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

.voting-results-by-event-and-category-item--place-1 .voting-results-by-event-and-category-item__trophy,
.voting-results-by-event-and-category-item--place-2 .voting-results-by-event-and-category-item__trophy,
.voting-results-by-event-and-category-item--place-3 .voting-results-by-event-and-category-item__trophy{
  display: unset;
}

.voting-results-by-event-and-category-item--place-1 {
  color: var(--yellow-400);
}

.voting-results-by-event-and-category-item--place-2 {
  color: var(--zinc-400);
}

.voting-results-by-event-and-category-item--place-3 {
  color: var(--orange-700);
}

.voting-results-by-event-and-category-item__trophy {
  display: none;
  width: 60px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.voting-results-by-event-and-category-item__place {
  position: relative;
  display: flex;
  justify-content: center;
  width: 60px;
  padding: var(--space-2);
  text-align: center;
}

.voting-results-by-event-and-category-item__place-number {
  font-size: 2rem;
}

.voting-results-by-event-and-category-item__place-ordinal {
  font-size: 0.7rem;
  vertical-align: .7em;
}
</style>