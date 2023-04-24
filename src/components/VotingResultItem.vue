<template>
  <div class="voting-result-item">
    <div class="voting-result-item__place">
      <p>{{ result.place }}</p>
    </div>
    <div class="voting-result-item__registration">
      <p>{{ result.registration.user.displayName }}</p>
      <p>{{ result.registration.vehicle.year }} {{ result.registration.vehicle.make }} {{ result.registration.vehicle.model }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { VotingResult } from '@/models'

  defineProps<{
    result: VotingResult,
  }>()
</script>

<style>
.voting-result-item {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: var(--space-3);
}

.voting-result-item__place {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>