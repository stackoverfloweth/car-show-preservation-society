<template>
  <div class="vehicle-list">
    <template v-for="vehicle in vehicles" :key="vehicle.vehicleId">
      <router-link :to="routes.vehicle(vehicle.vehicleId)">
        <VehicleCard :vehicle="vehicle" class="vehicles-list__vehicle" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import VehicleCard from '@/components/VehicleCard.vue'
  import { Vehicle } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    vehicles: Vehicle[],
  }>()
</script>

<style>
.vehicle-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: var(--space-4);
  gap: var(--space-5);
}

@media(max-width: 768px){
  .vehicle-list {
    grid-template-columns: 1fr;
  }
}
</style>