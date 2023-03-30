<template>
  <div class="vehicle-list">
    vehicle-list
  </div>
</template>

<script lang="ts" setup>
  import { Vehicle } from '@/models'

  defineProps<{
    vehicles: Vehicle[],
  }>()
</script>

<style>

</style>