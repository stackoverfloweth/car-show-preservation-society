<template>
  <p-radio
    v-model="carId"
    class="ballot-voting-category-option__option"
    :class="classes"
    label=""
    :value="registration.carId!"
    :disabled="isInvalidSelfVote"
  >
    <template #label>
      <div class="ballot-voting-category-option">
        <p class="ballot-voting-category-option__value ballot-voting-category-option__value--carId">
          {{ registration.carId }}
        </p>
        <p class="ballot-voting-category-option__value ballot-voting-category-option__value--year">
          {{ registration.vehicle?.year }}
        </p>
        <p class="ballot-voting-category-option__value ballot-voting-category-option__value--make">
          {{ registration.vehicle?.make }}
        </p>
        <p class="ballot-voting-category-option__value ballot-voting-category-option__value--model">
          {{ registration.vehicle?.model }}
        </p>
        <p class="ballot-voting-category-option__value ballot-voting-category-option__value--exteriorColor">
          {{ registration.vehicle?.color }}
        </p>
        <p class="ballot-voting-category-option__value ballot-voting-category-option__value--owner">
          {{ registration.user?.displayName }}
        </p>
      </div>
    </template>
  </p-radio>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { Event, Registration } from '@/models'
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    carId: string | null | undefined,
    event: Event,
    registration: Registration,
  }>()

  const emit = defineEmits<{
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

  const isInvalidSelfVote = computed(() => !props.event.canVoteForSelf && props.registration.userId === currentUser().userId)

  const classes = computed(() => ({
    'ballot-voting-category-option__option--selected': carId.value === props.registration.carId,
  }))
</script>

<style>
.ballot-voting-category-option {
  display: grid;
  column-gap: var(--space-sm);
  grid-template-areas: 'carId year make model exteriorColor owner';
  grid-template-columns: 60px 60px minmax(0, 1fr) minmax(0, 1fr) 60px minmax(0, 1fr);
  cursor: pointer;
}

.ballot-voting-category-option__value--carId {
  grid-area: carId;
  color: var(--gray-400);
}

.ballot-voting-category-option__value--year {
  grid-area: year;
}

.ballot-voting-category-option__value--make {
  grid-area: make;
}

.ballot-voting-category-option__value--model {
  grid-area: model;
}

.ballot-voting-category-option__value--exteriorColor {
  grid-area: exteriorColor;
}

.ballot-voting-category-option__value--owner {
  grid-area: owner;
}

.ballot-voting-category-option__value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ballot-voting-category-option__option {
  padding: var(--space-sm);
  border-radius: var(--rounded);
}

.ballot-voting-category-option__option:nth-child(even):not(.ballot-voting-category-option__option--selected) {
  background-color: var(--gray-700);
}

.ballot-voting-category-option__option--selected {
  background-color: var(--green-700);
}

.ballot-voting-category-option__option .p-label__header,
.ballot-voting-category-option__option .p-label__label {
  width: 100% !important;
}

@media(max-width: 768px){
  .ballot-voting-category-option {
    grid-template-areas:
      'carId make owner'
      'year model exteriorColor';
    grid-template-columns: 60px minmax(0, 1fr) min-content;
  }

  .ballot-voting-category-option__value--exteriorColor {
    text-align: right;
  }
}
</style>