<template>
  <p-table class="judging-categories-table" :data="categories" :columns="columns" @row:click="handleRowClick">
    <template #actions-heading>
      <span />
    </template>
    <template #judging="{ row }: {row: VotingCategory}">
      <template v-if="row.driversOnly">
        Only Registrants
      </template>
      <template v-else-if="row.membersOnly">
        Only Club Members
      </template>
      <template v-else>
        Open
      </template>
    </template>
    <template #extra-cost="{ row }: {row: VotingCategory}">
      <template v-if="row.stripePriceId">
        ${{ row.stripePriceId }}
      </template>
      <template v-else>
        $0
      </template>
    </template>
    <template #actions="{ row }: {row: VotingCategory}">
      <div class="judging-categories-table__actions">
        <TrashConfirm @confirmed="deleteCategory(row)" />
      </div>
    </template>
  </p-table>
</template>

<script lang="ts" setup>
  import { TableColumn, TableData } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import TrashConfirm from '@/components/TrashConfirm.vue'
  import { VotingCategory } from '@/models'

  defineProps<{
    categories: VotingCategory[],
  }>()

  const emit = defineEmits<{
    (event: 'delete:category' | 'edit:category', value: VotingCategory): void,
  }>()

  const columns = computed<TableColumn[]>(() => [
    { property: 'name', label: 'Name' },
    { property: 'maxCapacity', label: 'Max Cap' },
    { property: 'judging', label: 'Judging' },
    { property: 'stripePriceId', label: 'Extra Cost' },
    { label: 'Actions', width: '0' },
  ])

  function handleRowClick({ row }: { row: TableData }): void {
    editCategory(row as VotingCategory)
  }

  function deleteCategory(votingCategory: VotingCategory): void {
    emit('delete:category', votingCategory)
  }

  function editCategory(votingCategory: VotingCategory): void {
    emit('edit:category', votingCategory)
  }
</script>

<style>
.judging-categories-table__actions {
  display: flex;
  gap: var(--space-3);
}

.judging-categories-table .p-table-row {
  cursor: pointer;
}
</style>