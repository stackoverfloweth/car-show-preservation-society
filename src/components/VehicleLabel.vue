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
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vehicle-label__make {
  font-size: var(--text-md);
  overflow: hidden;
  text-overflow: ellipsis;
}

.vehicle-label__year {
  font-size: var(--text-xs);
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>