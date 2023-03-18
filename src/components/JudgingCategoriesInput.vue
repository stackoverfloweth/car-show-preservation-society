<template>
  <p-label class="judging-categories-input">
    <template #label>
      <div>Judging Categories</div>
      <div class="judging-categories-input__actions">
        <p-button class="judging-categories-input__add-button">
          Add Category
        </p-button>
        <p-icon-button-menu>
          <p-overflow-menu-item class="judging-categories-input__add-menu-icon" icon="PlusIcon" label="Add Category" />
          <p-overflow-menu-item icon="LightBulbIcon" label="Suggest Categories" @click="suggestCategories" />
          <MenuItemConfirm @confirm="removeAll">
            <template #default="{ open }">
              <p-overflow-menu-item icon="TrashIcon" label="Delete All" @click.stop="open" />
            </template>
          </MenuItemConfirm>
        </p-icon-button-menu>
      </div>
    </template>
  </p-label>
  <template v-if="categories.length">
    <JudgingCategoriesTable :categories="categories" @delete:category="removeCategory" />
  </template>
  <template v-else>
    <JudgingCategoriesEmptyState>
      <template #actions>
        <p-button>
          Add Category
        </p-button>

        <p-button inset icon="LightBulbIcon" @click="suggestCategories">
          Suggest Categories
        </p-button>
      </template>
    </JudgingCategoriesEmptyState>
  </template>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import JudgingCategoriesEmptyState from '@/components/JudgingCategoriesEmptyState.vue'
  import JudgingCategoriesTable from '@/components/JudgingCategoriesTable.vue'
  import MenuItemConfirm from '@/components/MenuItemConfirm.vue'
  import { VotingCategory } from '@/models'
  import { mocker } from '@/services'

  const props = defineProps<{
    categories: VotingCategory[],
  }>()

  const emit = defineEmits<{
    (event: 'update:categories', value: VotingCategory[]): void,
  }>()

  const categories = computed({
    get() {
      return props.categories
    },
    set(value) {
      emit('update:categories', value)
    },
  })

  function suggestCategories(): void {
    categories.value = [...categories.value, ...mocker.createMany('votingCategory', 10)]
  }

  function removeAll(): void {
    categories.value = []
  }

  function removeCategory({ votingCategoryId }: VotingCategory): void {
    categories.value = categories.value.filter(category => category.votingCategoryId === votingCategoryId)
  }
</script>

<style>
.judging-categories-input .p-label__label {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: start;
}

.judging-categories-input__actions {
  display: flex;
  gap: var(--space-3);
}

.judging-categories-input__add-menu-icon {
  display: none;
}

@media(max-width: 768px){
  .judging-categories-input__add-button {
    display: none;
  }

  .judging-categories-input__add-menu-icon {
    display: flex;
  }
}
</style>