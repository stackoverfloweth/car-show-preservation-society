<template>
  <div class="vehicle-card">
    <SizedImage class="vehicle-card__image" :image="vehicle.profileImage" />
    <VehicleLabel class="vehicle-card__label" :vehicle="vehicle" />
  </div>
</template>

<script lang="ts" setup>
  import SizedImage from '@/components/SizedImage.vue'
  import VehicleLabel from '@/components/VehicleLabel.vue'
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
  padding-top: 50%;
  border-radius: 0;
}

.vehicle-card__label {
  padding: var(--space-4);
}
</style>