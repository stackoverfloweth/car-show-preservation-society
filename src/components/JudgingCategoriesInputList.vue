<template>
  <div class="judging-categories-input-list">
    <template v-for="category in categories" :key="category.votingCategoryId">
      <JudgingCategoriesInputListItem
        :category="category"
        :selected="getIsSelected(category)"
        @edit:category="editCategory"
        @update:selected="toggleSelected(category)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import JudgingCategoriesInputListItem from '@/components/JudgingCategoriesInputListItem.vue'
  import { VotingCategory } from '@/models'

  const props = defineProps<{
    categories: VotingCategory[],
    selected: VotingCategory[],
  }>()

  const emit = defineEmits<{
    (event: 'edit:category', value: VotingCategory): void,
    (event: 'update:selected', value: VotingCategory[]): void,
  }>()

  const selected = computed({
    get() {
      return props.selected
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

  function editCategory(votingCategory: VotingCategory): void {
    emit('edit:category', votingCategory)
  }
</script>

<style>
.judging-categories-input-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.judging-categories-input-list .p-list-item-input__content {
  padding: 0;
}

.judging-categories-input-list__category:hover {
  cursor: pointer;
  background-color: var(--slate-700);
}

.judging-categories-input-list__category {
  display: grid;
  grid-template-areas:
    'name info-badges'
    'description description';
  grid-template-columns: minmax(0, 1fr) min-content;
  padding: var(--space-4);
}

.judging-categories-input-list__name {
  grid-area: name;
}

.judging-categories-input-list__description {
  grid-area: description;
  color: var(--slate-400);
  font-size: .75rem;
  line-height: 0.95rem;
}

.judging-categories-input-list__info-badges {
  display: flex;
  align-items: center;
  grid-area: info-badges;
  gap: var(--space-2);
}

.judging-categories-input-list__info-badge {
  white-space: nowrap;
  border-radius: var(--rounded);
  padding: var(--space-2) var(--space-3);
  background-color: var(--slate-600);
}
</style>