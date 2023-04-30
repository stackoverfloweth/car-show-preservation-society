<template>
  <div class="vehicles-page">
    <template v-if="onlyVehicle">
      <VehicleViewer :vehicle="onlyVehicle" />
    </template>
    <template v-else>
      <VehicleList :vehicles="vehicles" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import VehicleList from '@/components/VehicleList.vue'
  import VehicleViewer from '@/components/VehicleViewer.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services'

  const api = useApi()

  const vehiclesSubscription = useSubscription(api.vehicles.getVehicles, [currentUser.userId])
  const vehicles = computed(() => vehiclesSubscription.response ?? [])

  const onlyVehicle = computed(() => vehicles.value.length === 1 && !!vehicles.value.at(0) ? vehicles.value.at(0) : undefined)

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