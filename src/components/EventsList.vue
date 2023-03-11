<template>
  <div class="events-list">
    <p-table :data="events" :columns="columns" class="events-list__table" />
  </div>
</template>

<script lang="ts" setup>
  import { TableColumn } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import { Event } from '@/models/event'

  defineProps<{
    events: Event[],
  }>()

  const columns = computed<TableColumn[]>(() => [{ property: 'name', label: 'name' }])
</script>

<style>
.events-list__table thead {
  display: none;
}

.events-list__table tbody {
  border-top: 0;
}
</style>