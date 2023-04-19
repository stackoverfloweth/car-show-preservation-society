<template>
  <div class="events-filter">
    events-filter
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { EventsFilter } from '@/models/api/eventsFilter'
  import { EventsSort } from '@/models/api/eventsSort'

  const props = defineProps<{
    filter: EventsFilter,
    sort: EventsSort,
  }>()

  const emit = defineEmits<{
    (event: 'update:filter', value: EventsFilter): void,
    (event: 'update:sort', value: EventsSort): void,
  }>()

  const filter = computed({
    get() {
      return props.filter
    },
    set(value) {
      emit('update:filter', value)
    },
  })

  const sort = computed({
    get() {
      return props.sort
    },
    set(value) {
      emit('update:sort', value)
    },
  })
</script>

<style>

</style>