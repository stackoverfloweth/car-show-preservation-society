<template>
  <div class="event-registration-form-fields">
    event-registration-form
  </div>
</template>

<script lang="ts" setup>
  import { IEvent } from '@/models'

  defineProps<{
    event: IEvent,
  }>()
</script>