<template>
  <div class="voting-result-item">
    <div class="voting-result-item__place">
      <p>{{ result.place }}</p>
    </div>
    <div class="voting-result-item__registration">
      <p>{{ user?.displayName }}</p>
      <p>{{ vehicle?.year }} {{ vehicle?.make }} {{ vehicle?.model }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useApi } from '@/compositions'
  import { VotingResult } from '@/models'

  const props = defineProps<{
    result: VotingResult,
  }>()

  const api = useApi()

  const userSubscriptionArgs = computed<Parameters<typeof api.users.getUser> | null>(() => {
    if (!props.result.registration.user) {
      return [props.result.registration.userId]
    }

    return null
  })
  const userSubscription = useSubscriptionWithDependencies(api.users.getUser, userSubscriptionArgs)
  const user = computed(() => props.result.registration.user ?? userSubscription.response)

  const vehicleSubscriptionArgs = computed<Parameters<typeof api.vehicles.getVehicle> | null>(() => {
    if (!props.result.registration.vehicle && !!props.result.registration.vehicleId) {
      return [props.result.registration.vehicleId]
    }

    return null
  })
  const vehicleSubscription = useSubscriptionWithDependencies(api.vehicles.getVehicle, vehicleSubscriptionArgs)
  const vehicle = computed(() => props.result.registration.vehicle ?? vehicleSubscription.response)
</script>

<style>
.voting-result-item {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: var(--space-sm);
}

.voting-result-item__place {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>