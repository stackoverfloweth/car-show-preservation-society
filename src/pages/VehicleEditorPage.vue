<template>
  <p-form class="vehicle-editor-page" @submit="submit">
    <div class="vehicle-editor-page__general">
      <PageHeader heading="General" />
      <VehicleFormFields v-if="values" v-model:values="values" />
    </div>

    <div class="vehicle-editor-page__gallery">
      <PageHeader heading="Gallery" />
      <VehicleGalleryForm v-if="values" :vehicle-id="vehicleId" />
    </div>
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
  import VehicleFormFields from '@/components/VehicleFormFields.vue'
  import VehicleGalleryForm from '@/components/VehicleGalleryForm.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { VehicleRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { mapper } from '@/services'

  const vehicleId = useRouteParam('vehicleId')

  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const vehicleSubscription = useSubscription(api.vehicles.getVehicle, [vehicleId])
  const values = ref<VehicleRequest | undefined>()

  watchEffect(() => {
    values.value = mapper.map('Vehicle', vehicleSubscription.response, 'VehicleRequest')
  })

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.vehicles.updateVehicle(values.value!)

    showToast('Saved!', 'success')

    vehicleSubscription.refresh()
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