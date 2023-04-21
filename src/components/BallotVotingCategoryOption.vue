<template>
  <div class="ballot-voting-category-option">
    <p class="ballot-voting-category-option__value ballot-voting-category-option__value--carId">
      {{ registration.carId }}
    </p>
    <p class="ballot-voting-category-option__value ballot-voting-category-option__value--year">
      {{ vehicle.year }}
    </p>
    <p class="ballot-voting-category-option__value ballot-voting-category-option__value--make">
      {{ vehicle.make }}
    </p>
    <p class="ballot-voting-category-option__value ballot-voting-category-option__value--model">
      {{ vehicle.model }}
    </p>
    <p class="ballot-voting-category-option__value ballot-voting-category-option__value--exteriorColor">
      {{ vehicle.color }}
    </p>
    <p class="ballot-voting-category-option__value ballot-voting-category-option__value--owner">
      {{ user.displayName }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  import { Registration, User, Vehicle } from '@/models'

  defineProps<{
    registration: Registration,
    vehicle: Vehicle,
    user: User,
  }>()
</script>

<style>
.ballot-voting-category-option {
  display: grid;
  column-gap: var(--space-2);
  grid-template-areas: 'carId year make model exteriorColor owner';
  grid-template-columns: 60px 60px minmax(0, 1fr) minmax(0, 1fr) 60px minmax(0, 1fr);
  cursor: pointer;
}

.ballot-voting-category-option__value--carId {
  grid-area: carId;
  color: var(--slate-400);
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