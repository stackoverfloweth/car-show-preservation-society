<template>
  <div class="voting-results-by-category-item" :class="classes.item">
    <div class="voting-results-by-category-item__header">
      <template v-if="votingCategory.featured">
        <p-icon icon="StarIcon" class="voting-results-by-category-item__star-icon" />
      </template>
      <p class="voting-results-by-category-item__name">
        {{ votingCategory.name }}
      </p>
      <div class="voting-results-by-category-item__actions">
        <template v-if="open">
          <p-link @click="showFewer">
            Show Fewer
          </p-link>
        </template>

        <template v-else>
          <p-link @click="showMore">
            Show All
          </p-link>
        </template>
      </div>
    </div>
    <div class="voting-results-by-category-item__description" :class="classes.description">
      {{ votingCategory.description }}
    </div>

    <div class="voting-results-by-category-item__results">
      <template v-for="result in first" :key="result.registration.registrationId">
        <VotingResultItem :result="result" />
      </template>
    </div>

    <p-auto-height-transition>
      <div v-if="open" class="voting-results-by-category-item__results">
        <template v-for="result in rest" :key="result.registration.registrationId">
          <VotingResultItem :result="result" />
        </template>
      </div>
    </p-auto-height-transition>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import VotingResultItem from '@/components/VotingResultItem.vue'
  import { VotingCategory, VotingResult } from '@/models'

  const props = defineProps<{
    votingCategory: VotingCategory,
    results: VotingResult[],
  }>()

  const first = computed<VotingResult[]>(() => {
    return props.results.filter(result => result.placeNumber === 1)
  })

  const rest = computed<VotingResult[]>(() => {
    return props.results.filter(result => result.placeNumber > 1)
  })

  const classes = computed(() => ({
    item: {
      'voting-results-by-category-item--featured': props.votingCategory.featured,
    },
    description: {
      'voting-results-by-category-item__description--closed': !open.value,
    },
  }))

  const open = ref(false)

  function showMore(): void {
    open.value = true
  }

  function showFewer(): void {
    open.value = false
  }
</script>

<style>
.voting-results-by-category-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--rounded);
  background-color: var(--gray-800);
}

.voting-results-by-category-item__star-icon {
  color: var(--yellow-600);
}

.voting-results-by-category-item__header {
  display: flex;
  align-items: center;
  font-weight: bold;
  gap: var(--space-sm);
}

.voting-results-by-category-item__name {
  flex-grow: 1;
}

.voting-results-by-category-item__description {
  cursor: pointer;
  color: var(--gray-400);
  transition: height 1s;
}

.voting-results-by-category-item__description--closed {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.voting-results-by-category-item__results {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.voting-results-by-category-item__actions {
  display: flex;
  justify-content: center;
}
</style>