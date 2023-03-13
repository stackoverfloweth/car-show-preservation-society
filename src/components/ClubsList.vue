<template>
  <p-table :data="clubs" :columns="columns" class="clubs-list" />
</template>

  <script lang="ts" setup>
  import { TableColumn } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import { Club } from '@/models/club'

  defineProps<{
    clubs: Club[],
  }>()

  const columns = computed<TableColumn[]>(() => [{ property: 'name', label: 'name' }])
  </script>

  <style>
  .clubs-list tr {
    cursor: pointer;
  }

  .clubs-list tr:hover {
    background-color: var(--slate-700);
  }

  .clubs-list thead {
    display: none;
  }

  .clubs-list tbody {
    border-top: 0;
  }
  </style>