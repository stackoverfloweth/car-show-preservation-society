<template>
  <div class="judging-categories-table">
    <template v-for="category in categories" :key="category.votingCategoryId">
      <JudgingCategoriesTableRow :category="category" :role="selectable ? 'button' : 'listitem'" :selected="getIsSelected(category)" @update:selected="toggleSelected(category)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import JudgingCategoriesTableRow from '@/components/JudgingCategoriesTableRow.vue'
  import { VotingCategory } from '@/models'

  const props = defineProps<{
    categories: VotingCategory[],
    selected?: string[],
  }>()

  const emit = defineEmits<{
    (event: 'update:selected', value: string[]): void,
  }>()

  const selectable = computed(() => props.selected !== undefined)

  const selected = computed({
    get() {
      return props.selected ?? []
    },
    set(value) {
      emit('update:selected', value)
    },
  })

  function getIsSelected(category: VotingCategory): boolean {
    return selected.value.some(categoryId => category.votingCategoryId === categoryId)
  }

  function toggleSelected(category: VotingCategory): void {
    const isSelected = getIsSelected(category)

    if (isSelected) {
      selected.value = [...selected.value.filter(categoryId => categoryId !== category.votingCategoryId)]
    } else {
      selected.value = [...selected.value, category.votingCategoryId]
    }
  }
</script>

<style>
.judging-categories-table {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>