<template>
  <VehicleViewer v-if="vehicle" :vehicle="vehicle" class="vehicle-page" />
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import VehicleViewer from '@/components/VehicleViewer.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const vehicleId = useRouteParam('vehicleId')
  const api = useApi()

  const vehicleSubscription = useSubscription(api.vehicles.getVehicle, [vehicleId])
  const vehicle = computed(() => vehicleSubscription.response)

  useNavigation({
    left: route.name === 'vehicles.view' ? { title: 'Garage', route: routes.vehicles() } : undefined,
  })
</script>

<style>
.vehicle-page {
  padding: var(--space-4);
}
</style>