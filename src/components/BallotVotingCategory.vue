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
    <p-auto-height-transition>
      <div v-if="open" class="ballot-voting-category__contents">
        <div class="ballot-voting-category__description">
          {{ votingCategory?.description }}
          <template v-if="carId">
            <p-button inset size="sm" @click="unsetVote">
              Reset
            </p-button>
          </template>
        </div>
        <BallotVotingCategoryOptions v-model:car-id="carId" :voting-category-id="votingCategory.votingCategoryId" :event="event" />
      </div>
    </p-auto-height-transition>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import BallotVotingCategoryOptions from '@/components/BallotVotingCategoryOptions.vue'
  import { VotingCategory, Event } from '@/models'

  const props = defineProps<{
    votingCategory: VotingCategory,
    event: Event,
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
  background-color: var(--gray-800);
  border: 1px solid var(--gray-600);
  gap: var(--space-sm);
}

.ballot-voting-category__voting-category {
  display: flex;
  align-items: center;
  font-size: var(--text-md);
  padding: var(--space-md);
  gap: var(--space-md);
}

.ballot-voting-category__title {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
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
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
}

.ballot-voting-category__description {
  display: flex;
  justify-content: space-between;
  align-items: start;
}
</style>