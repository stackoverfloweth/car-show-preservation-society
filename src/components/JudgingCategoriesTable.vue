<template>
  <p-table class="judging-categories-table" :data="categories" :columns="columns">
    <template #actions-heading>
      <span />
    </template>
    <template #actions="{ row }">
      <TrashConfirm @confirm="remove(row)" />
    </template>
  </p-table>
</template>

<script lang="ts" setup>
  import { TableColumn } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import TrashConfirm from '@/components/TrashConfirm.vue'
  import { VotingCategory } from '@/models'

  defineProps<{
    categories: VotingCategory[],
  }>()

  const emits = defineEmits<{
    (event: 'delete:category', value: VotingCategory): void,
  }>()

  const columns = computed<TableColumn[]>(() => [
    { property: 'name', label: 'Name' },
    { label: 'Actions', width: '0' },
  ])

  function remove(category: VotingCategory): void {
    emits('delete:category', category)
  }
</script>