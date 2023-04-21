<template>
  <div class="ballot-voting-category" :class="classes.root">
    <button type="button" class="ballot-voting-category__voting-category" @click="toggle">
      <div class="ballot-voting-category__title">
        <PIcon v-if="carId" icon="CheckIcon" class="ballot-voting-category__voted-icon" />
        {{ votingCategory?.name }}
      </div>
      <template v-if="carId">
        <p-tag class="ballot-voting-category__voted">
          {{ carId }}
        </p-tag>
      </template>
      <PIcon
        icon="ChevronRightIcon"
        class="ballot-voting-category__indicator"
        :class="classes.indicator"
      />
    </button>
    <PAutoHeightTransition>
      <div v-if="open" class="ballot-voting-category__contents">
        <div class="ballot-voting-category__description">
          {{ votingCategory?.description }}
          <template v-if="carId">
            <p-button inset size="sm" @click="unsetVote">
              Reset
            </p-button>
          </template>
        </div>
        <BallotVotingCategoryOptions v-model:car-id="carId" :voting-category-id="votingCategory.votingCategoryId" />
      </div>
    </PAutoHeightTransition>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import BallotVotingCategoryOptions from '@/components/BallotVotingCategoryOptions.vue'
  import { VotingCategory } from '@/models'

  const props = defineProps<{
    votingCategory: VotingCategory,
    open: boolean,
    carId: string | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:open', value: boolean): void,
    (event: 'update:carId', value: string | null): void,
  }>()

  const carId = computed({
    get() {
      return props.carId ?? null
    },
    set(value) {
      emit('update:carId', value)
    },
  })

  const open = computed({
    get() {
      return props.open
    },
    set(value) {
      emit('update:open', value)
    },
  })

  const classes = computed(() => ({
    root: {
      'ballot-voting-category--complete': !!props.carId,
      'ballot-voting-category--open': open.value,
    },
    indicator: {
      'ballot-voting-category__indicator--open': open.value,
    },
  }))

  function toggle(): void {
    open.value = !open.value
  }

  function unsetVote(): void {
    carId.value = null
  }
</script>

<style>
.ballot-voting-category {
  display: flex;
  flex-direction: column;
  background-color: var(--slate-800);
  border: 1px solid var(--slate-600);
  gap: var(--space-2);
}

.ballot-voting-category__voting-category {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  padding: var(--space-4);
  gap: var(--space-4);
}

.ballot-voting-category__title {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.ballot-voting-category__voted-icon {
  color: var(--green-600);
}

.ballot-voting-category__voted {
  background-color: var(--green-700) !important;
  text-align: center;
}

.ballot-voting-category__indicator {
  transition: rotate 50ms;
}

.ballot-voting-category__indicator--open {
  rotate: 90deg;
}

.ballot-voting-category__contents {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-2) var(--space-4);
}

.ballot-voting-category__description {
  display: flex;
  justify-content: space-between;
  align-items: start;
}
</style>