<template>
  <div class="vehicle-label">
    <div class="vehicle-label__year">
      {{ vehicle.year }}
    </div>
    <div class="vehicle-label__make">
      {{ vehicle.make }}
    </div>
    <div class="vehicle-label__model">
      {{ vehicle.model }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Vehicle } from '@/models'

  defineProps<{
    vehicle: Vehicle,
  }>()
</script>

<style>
.vehicle-label {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.vehicle-label__make {
  font-size: 1.25rem;
}

.vehicle-label__year {
  font-size: .75rem;
}
</style>