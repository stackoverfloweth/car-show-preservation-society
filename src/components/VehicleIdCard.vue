<template>
  <VehicleCard v-if="vehicle" :vehicle="vehicle" />
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import VehicleCard from '@/components/VehicleCard.vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    vehicleId: string,
  }>()

  const api = useApi()
  const { vehicleId } = toRefs(props)

  const vehicleSubscription = useSubscription(api.vehicles.getVehicle, [vehicleId])
  const vehicle = computed(() => vehicleSubscription.response)
</script>