<template>
  <div class="judging-categories-input-table">
    <template v-for="category in categories" :key="category.votingCategoryId">
      <p-list-item-input v-model:selected="selected" :value="category.votingCategoryId" @click="editCategory(category)">
        {{ category.name }}
        {{ category.maxCapacity }}
        {{ category.driversOnly }}
        {{ category.stripePriceId }}
        <div class="judging-categories-input-table__actions">
          <TrashConfirm @confirmed="deleteCategory(category)" />
        </div>
      </p-list-item-input>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import TrashConfirm from '@/components/TrashConfirm.vue'
  import { VotingCategory } from '@/models'

  const props = defineProps<{
    categories: VotingCategory[],
    selected: string[],
  }>()

  const emit = defineEmits<{
    (event: 'delete:category' | 'edit:category', value: VotingCategory): void,
    (event: 'update:selected', value: string[]): void,
  }>()

  const selected = computed({
    get() {
      return props.selected
    },
    set(value) {
      emit('update:selected', value)
    },
  })

  function deleteCategory(votingCategory: VotingCategory): void {
    emit('delete:category', votingCategory)
  }

  function editCategory(votingCategory: VotingCategory): void {
    emit('edit:category', votingCategory)
  }
</script>

<style>
.judging-categories-input-table {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.judging-categories-input-table__actions {
  display: flex;
  gap: var(--space-3);
}
</style>