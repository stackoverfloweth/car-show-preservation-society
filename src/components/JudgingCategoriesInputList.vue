<template>
  <p-virtual-scroller
    class="judging-categories-input-list"
    :item-estimate-height="140"
    :items="categories"
    item-key="votingCategoryId"
    :chunk-size="10"
    :gap="5"
  >
    <template #default="{ item }:{item: VotingCategory}">
      <JudgingCategoriesInputListItem
        :category="item"
        :selected="getIsSelected(item)"
        @edit:category="editCategory"
        @update:selected="toggleSelected(item)"
      />
    </template>
  </p-virtual-scroller>
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
.judging-categories-input-list .p-list-item-input__content {
  padding: 0;
}

.judging-categories-input-list__name {
  grid-area: name;
}

.judging-categories-input-list__description {
  grid-area: description;
  color: var(--gray-400);
  font-size: var(--text-xs);
  line-height: 0.95rem;
}

.judging-categories-input-list__info-badges {
  display: flex;
  align-items: center;
  grid-area: info-badges;
  gap: var(--space-sm);
}

.judging-categories-input-list__info-badge {
  white-space: nowrap;
  border-radius: var(--rounded);
  padding: var(--space-sm) var(--space-sm);
  background-color: var(--gray-600);
}
</style>