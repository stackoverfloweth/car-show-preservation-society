<template>
  <div class="clubs-filter">
    clubs-filter
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { ClubsFilter } from '@/models/api/clubsFilter'
  import { ClubsSort } from '@/models/api/clubsSort'

  const props = defineProps<{
    filter: ClubsFilter,
    sort: ClubsSort,
  }>()

  const emit = defineEmits<{
    (event: 'update:filter', value: ClubsFilter): void,
    (event: 'update:sort', value: ClubsSort): void,
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