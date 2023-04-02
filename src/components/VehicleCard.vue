<template>
  <div class="vehicle-card">
    <SizedImage v-if="vehicle.profileImage" class="vehicle-card__image" :image="vehicle.profileImage" />
    <div v-else class="vehicle-card__image">
      <p-icon icon="PhotographIcon" size="large" />
    </div>
    <div class="vehicle-card__content">
      <div class="vehicle-card__year">
        {{ vehicle.year }}
      </div>
      <div class="vehicle-card__make">
        {{ vehicle.make }}
      </div>
      <div class="vehicle-card__model">
        {{ vehicle.model }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SizedImage from '@/components/SizedImage.vue'
  import { Vehicle } from '@/models'

  defineProps<{
    vehicle: Vehicle,
  }>()
</script>

<style>
.vehicle-card {
  border: 1px solid var(--slate-500);
  border-radius: var(--rounded);
  overflow: hidden;
  background-color: var(--slate-800);
}

.vehicle-card__image {
  height: 120px;
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--slate-700);
}

.vehicle-card__content {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.vehicle-card__make {
  font-size: 1.25rem;
}

.vehicle-card__year {
  font-size: .75rem;
}
</style>