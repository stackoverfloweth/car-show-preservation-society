<template>
  <div class="judging-categories-list">
    <template v-for="category in categories" :key="category.votingCategoryId">
      <JudgingCategoriesListItem :category="category" :role="selectable ? 'button' : 'listitem'" :selected="getIsSelected(category)" @update:selected="toggleSelected(category)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import JudgingCategoriesListItem from '@/components/JudgingCategoriesListItem.vue'
  import { VotingCategory } from '@/models'

  const props = defineProps<{
    categories: VotingCategory[],
    selected?: VotingCategory[],
  }>()

  const emit = defineEmits<{
    (event: 'update:selected', value: VotingCategory[]): void,
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
    return selected.value.some(({ votingCategoryId }) => category.votingCategoryId === votingCategoryId)
  }

  function toggleSelected(category: VotingCategory): void {
    const isSelected = getIsSelected(category)

    if (isSelected) {
      selected.value = [...selected.value.filter(({ votingCategoryId }) => category.votingCategoryId !== votingCategoryId)]
    } else {
      selected.value = [...selected.value, category]
    }
  }
</script>

<style>
.judging-categories-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>