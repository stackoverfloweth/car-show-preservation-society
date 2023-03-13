<template>
  <p-table class="events-list" :data="events" :columns="columns" />
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
.events-list tr {
  cursor: pointer;
}

.events-list tr:hover {
  background-color: var(--slate-700);
}

.events-list thead {
  display: none;
}

.events-list tbody {
  border-top: 0;
}
</style>