<template>
  <p-card class="event-card">
    <p-content>
      {{ event.name }}
    </p-content>
  </p-card>
</template>

<script lang="ts" setup>
  import { Event } from '@/models/event'

  defineProps<{
    event: Event,
  }>()
</script>