<template>
  <div class="registrations-list-item">
    {{ registration }}
  </div>
</template>

<script lang="ts" setup>
  import { Registration } from '@/models'

  defineProps<{
    registration: Registration,
  }>()
</script>

<style>

</style>