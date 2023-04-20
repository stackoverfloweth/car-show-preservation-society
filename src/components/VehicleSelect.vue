<template>
  <div class="vehicle-select">
    <template v-for="vehicle in vehicles" :key="vehicle.vehicleId">
      <VehicleCard
        :vehicle="vehicle"
        class="vehicle-select__vehicle"
        :class="{ 'vehicle-select__vehicle--selected': selected?.vehicleId === vehicle.vehicleId }"
        @click="selected = vehicle"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import VehicleCard from '@/components/VehicleCard.vue'
  import { useApi } from '@/compositions'
  import { Vehicle } from '@/models'

  const props = defineProps<{
    selected: Vehicle | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:selected', value: Vehicle | null): void,
  }>()

  const api = useApi()

  const selected = computed({
    get() {
      return props.selected ?? null
    },
    set(value) {
      emit('update:selected', value)
    },
  })

  const vehiclesSubscription = useSubscription(api.vehicles.getVehicles, [])
  const vehicles = computed(() => vehiclesSubscription.response ?? [])
</script>

<style>
.vehicle-select {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.vehicle-select__vehicle--selected {
  outline: 2px solid var(--blue-600);
  outline-offset: 2px;
}
</style>