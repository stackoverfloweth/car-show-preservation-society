<template>
  <div class="ballot-voting-category-options">
    <template v-for="({ registration, vehicle, user }) in options" :key="registration.registrationId">
      <p-radio v-model="carId" class="ballot-voting-category-options__option" label="" :value="registration.carId!" :name="votingCategoryId">
        <template #label>
          <div class="ballot-voting-category-options__option-label">
            <p class="ballot-voting-category-options__option-value ballot-voting-category-options__option-value--carId">
              {{ registration.carId }}
            </p>
            <p class="ballot-voting-category-options__option-value ballot-voting-category-options__option-value--year">
              {{ vehicle.year }}
            </p>
            <p class="ballot-voting-category-options__option-value ballot-voting-category-options__option-value--make">
              {{ vehicle.make }}
            </p>
            <p class="ballot-voting-category-options__option-value ballot-voting-category-options__option-value--model">
              {{ vehicle.model }}
            </p>
            <p class="ballot-voting-category-options__option-value ballot-voting-category-options__option-value--exteriorColor">
              {{ vehicle.color }}
            </p>
            <p class="ballot-voting-category-options__option-value ballot-voting-category-options__option-value--owner">
              {{ user.displayName }}
            </p>
          </div>
        </template>
      </p-radio>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    votingCategoryId: string,
    carId: string | null | undefined,
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

  const { votingCategoryId } = toRefs(props)
  const api = useApi()

  const optionsSubscription = useSubscription(api.votingCategories.getVotingCategoryOptions, [votingCategoryId])
  const options = computed(() => optionsSubscription.response ?? [])
</script>

<style>
.ballot-voting-category-options {
  height: 380px;
  display: grid;
  flex-direction: column;
  gap: var(--space-2);
  overflow-y: auto;
}

.ballot-voting-category-options__option {
  padding: var(--space-2);
}

.ballot-voting-category-options__option:nth-child(even) {
  background-color: var(--slate-700);
}

.ballot-voting-category-options__option .p-label__header,
.ballot-voting-category-options__option .p-label__label {
  width: 100% !important;
}

.ballot-voting-category-options__option-label {
  display: grid;
  column-gap: var(--space-2);
  grid-template-areas: 'carId year make model exteriorColor owner';
  grid-template-columns: 60px 60px minmax(0, 1fr) minmax(0, 1fr) 60px minmax(0, 1fr);
  cursor: pointer;
}

.ballot-voting-category-options__option-value--carId {
  grid-area: carId;
  color: var(--slate-400);
}

.ballot-voting-category-options__option-value--year {
  grid-area: year;
}

.ballot-voting-category-options__option-value--make {
  grid-area: make;
}

.ballot-voting-category-options__option-value--model {
  grid-area: model;
}

.ballot-voting-category-options__option-value--exteriorColor {
  grid-area: exteriorColor;
}

.ballot-voting-category-options__option-value--owner {
  grid-area: owner;
}

.ballot-voting-category-options__option-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media(max-width: 768px){
  .ballot-voting-category-options__option-label {
    grid-template-areas:
      'carId make owner'
      'year model exteriorColor';
    grid-template-columns: 60px minmax(0, 1fr) min-content;
  }

  .ballot-voting-category-options__option-value--exteriorColor {
    text-align: right;
  }
}
</style>