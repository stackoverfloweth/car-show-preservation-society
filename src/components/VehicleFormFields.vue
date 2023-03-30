<template>
  <div class="vehicle-form-fields">
    vehicle-form-fields
  </div>
</template>

<script lang="ts" setup>
  import { VehicleRequest } from '@/models/api'

  defineProps<{
    values: VehicleRequest,
  }>()
</script>

<style>

</style>