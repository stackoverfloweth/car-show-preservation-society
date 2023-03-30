<template>
  <div class="vehicles-page">
    <VehicleList :vehicles="vehicles" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import VehicleList from '@/components/VehicleList.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const api = useApi()

  const vehiclesSubscription = useSubscription(api.vehicles.getVehicles)
  const vehicles = computed(() => vehiclesSubscription.response ?? [])

  useNavigation({
    center: { title: 'Garage' },
    right: { title: 'New', route: routes.vehicleCreate() },
  })
</script>

<style>
.vehicles-page {
  padding: var(--space-4);
}
</style>