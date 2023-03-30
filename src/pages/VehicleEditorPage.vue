<template>
  <p-form class="vehicle-editor-page" @submit="submit">
    <div class="vehicle-editor-page__general">
      <p-bread-crumbs :crumbs="[{ text: 'General' }]" />
      <VehicleFormFields v-if="values" v-model:values="values" />
    </div>
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import VehicleFormFields from '@/components/VehicleFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { Vehicle } from '@/models'
  import { VehicleRequest } from '@/models/api'
  import { routes } from '@/router/routes'

  const vehicleId = useRouteParam('vehicleId')

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const vehicleSubscription = useSubscription(api.vehicles.getVehicle, [vehicleId])
  const { response: vehicle } = await vehicleSubscription.promise()

  const values = ref<Vehicle | undefined>(vehicle)

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.vehicles.createVehicle(values.value as VehicleRequest)

    showToast('Saved!', 'success')
    router.push(routes.vehicle(vehicleId.value))
  }

  watchEffect(() => {
    set({
      left: { title: 'Vehicle', route: routes.vehicle(vehicleId.value) },
      right: { title: 'Save', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.vehicle-editor-page {
  padding: var(--space-4);
}
</style>