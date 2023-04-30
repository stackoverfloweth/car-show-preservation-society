<template>
  <p-card class="vehicle-card">
    <SizedImage class="vehicle-card__image" :image="vehicle.image" />
    <VehicleLabel class="vehicle-card__label" :vehicle="vehicle" />
  </p-card>
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
  overflow: hidden;
  padding: 0;
}

.vehicle-card__image {
  padding-top: 50%;
  border-radius: 0;
}

.vehicle-card__label {
  padding: var(--space-4);
}
</style>