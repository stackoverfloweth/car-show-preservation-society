<template>
  <div class="vehicle-select">
    <template v-for="vehicle in vehicles" :key="vehicle.vehicleId">
      <VehicleCard
        :vehicle="vehicle"
        role="button"
        class="vehicle-select__vehicle"
        :class="{ 'vehicle-select__vehicle--selected': vehicleId === vehicle.vehicleId }"
        @click="vehicleId = vehicle.vehicleId"
      />
    </template>
    <p-card class="vehicle-select__vehicle vehicle-select__vehicle--new" role="button" @click="open">
      Add Vehicle
    </p-card>
    <p-modal v-model:showModal="showModal" title="New Vehicle" auto-close>
      <p-form @submit="submit">
        <VehicleFormFields v-model:values="newVehicle" class="vehicle-select__new-vehicle-form" />
        <div class="vehicle-select__new-vehicle-actions">
          <p-button inset @click="close">
            Cancel
          </p-button>
          <p-button type="submit" :loading="pending">
            Add Vehicle
          </p-button>
        </div>
      </p-form>
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import VehicleCard from '@/components/VehicleCard.vue'
  import VehicleFormFields from '@/components/VehicleFormFields.vue'
  import { useApi, useShowModal } from '@/compositions'
  import { VehicleRequest } from '@/models/api'
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    vehicleId: string | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:vehicleId', value: string | null): void,
  }>()

  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const { showModal, open, close } = useShowModal()

  const vehicleId = computed({
    get() {
      return props.vehicleId ?? null
    },
    set(value) {
      emit('update:vehicleId', value)
    },
  })

  const vehiclesSubscription = useSubscription(api.vehicles.getVehicles, [currentUser().userId])
  const vehicles = computed(() => vehiclesSubscription.response ?? [])

  const newVehicle = ref<VehicleRequest>({ userId: currentUser().userId })

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.vehicles.createVehicle(newVehicle.value as VehicleRequest)

    showToast('Vehicle Created!', 'success')
    vehiclesSubscription.refresh()
  }
</script>

<style>
.vehicle-select {
  --num-cols: 3;
  display: grid;
  grid-template-columns: repeat(var(--num-cols), 1fr);
  gap: var(--space-md);
}

.vehicle-select__vehicle--selected {
  outline: 2px solid var(--blue-600);
  outline-offset: 2px;
}

.vehicle-select__vehicle--new {
  display: flex;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 150px;
}

.vehicle-select__new-vehicle-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: space-between;
}

.vehicle-select__new-vehicle-form {
  grid-template-columns: 1fr !important;
}

@media(max-width: 768px){
  .vehicle-select {
    --num-cols: 2;
  }

  .vehicle-select__new-vehicle-actions {
    flex-direction: column;
  }
}
</style>