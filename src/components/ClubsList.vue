<template>
  <div class="clubs-list">
    <p-table :data="clubs" :columns="columns" class="clubs-list__table" @row:click="handleRowClick" />
  </div>
</template>

  <script lang="ts" setup>
  import { TableColumn } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import { Club } from '@/models/club'

  defineProps<{
    clubs: Club[],
  }>()

  const emit = defineEmits<{
    (event: 'select:club', value: Club): void,
  }>()

  const columns = computed<TableColumn[]>(() => [{ property: 'name', label: 'name' }])

  function handleRowClick({ row }: { row: Club }): void {
    emit('select:club', row)
  }
  </script>

  <style>
  .clubs-list__table thead {
    display: none;
  }

  .clubs-list__table tbody {
    border-top: 0;
  }
  </style>