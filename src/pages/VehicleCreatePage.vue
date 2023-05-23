<template>
  <div class="vehicle-create-page">
    <PageHeader heading="Vehicle Information" />

    <p-form @submit="submit">
      <VehicleFormFields v-model:values="values" />
    </p-form>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import PageHeader from '@/components/PageHeader.vue'
  import VehicleFormFields from '@/components/VehicleFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { VehicleRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { currentIdentity } from '@/services/auth'

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const values = ref<VehicleRequest>({ userId: currentIdentity() })

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.vehicles.createVehicle(values.value as VehicleRequest)

    showToast('Vehicle Created!', 'success')
    router.push(routes.vehicles())
  }

  watchEffect(() => {
    const backEnabled = window.history.length > 1

    set({
      left: backEnabled ? { title: 'Cancel', showChevron: false, callback: router.back } : { title: 'Garage', route: routes.vehicles() },
      right: { title: 'Create', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.vehicle-create-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-md);
  gap: var(--space-sm);
}
</style>