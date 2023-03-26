<template>
  <div class="event-judging-results">
    event-judging-results
  </div>
</template>

<script lang="ts" setup>
  import { Event } from '@/models'

  defineProps<{
    event: Event,
  }>()
</script>