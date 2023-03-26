<template>
  <p-label class="judging-categories-input">
    <template #label>
      <div>Judging Categories</div>
      <div class="judging-categories-input__actions">
        <template v-if="selectedCategories.length">
          <TrashConfirm @confirmed="deleteSelected">
            <template #default="{ open: openConfirm }">
              <p-button danger @click="openConfirm">
                Delete Selected
              </p-button>
            </template>
          </TrashConfirm>
          <p-button inset @click="clearSelected">
            Clear Selected
          </p-button>
        </template>
        <template v-else>
          <p-button class="judging-categories-input__add-button" @click="open">
            Add Category
          </p-button>
          <p-icon-button-menu>
            <p-overflow-menu-item class="judging-categories-input__add-menu-icon" icon="PlusIcon" label="Add Category" @click="open" />
            <p-overflow-menu-item icon="LightBulbIcon" label="Suggest Categories" @click="suggestCategories" />
            <MenuItemConfirm @confirm="deleteAll">
              <template #default="{ open: openConfirmation }">
                <p-overflow-menu-item icon="TrashIcon" label="Delete All" @click.stop="openConfirmation" />
              </template>
            </MenuItemConfirm>
          </p-icon-button-menu>
        </template>
      </div>
    </template>
  </p-label>

  <template v-if="votingCategories.length">
    <JudgingCategoriesInputTable
      v-model:selected="selectedCategories"
      :categories="votingCategories"
      @delete:category="deleteCategory"
      @edit:category="editCategory"
    />
  </template>

  <template v-else>
    <JudgingCategoriesEmptyState>
      <template #actions>
        <p-button @click="open">
          Add Category
        </p-button>

        <p-button inset icon="LightBulbIcon" @click="suggestCategories">
          Suggest Categories
        </p-button>
      </template>
    </JudgingCategoriesEmptyState>
  </template>

  <p-modal v-model:show-modal="showModal" :title="modalTitle" auto-close>
    <p-form @submit="saveCategoryForm">
      <JudgingCategoryFormFields v-model:values="categoryFormValues" />
      <template v-if="isVotingCategory(categoryFormValues)">
        <div class="judging-category-input__modal-actions">
          <TrashConfirm @confirmed="deleteSelectedCategory">
            <template #default="{ open: openConfirm }">
              <p-button class="judging-category-input__modal-delete-button" danger @click="openConfirm">
                Delete Category
              </p-button>
            </template>
          </TrashConfirm>
          <p-button type="submit" inset :loading="pending">
            Save
          </p-button>
        </div>
      </template>
      <template v-else>
        <p-button type="submit" :loading="pending">
          Add Category
        </p-button>
      </template>
    </p-form>
  </p-modal>
</template>

<script lang="ts">
  export default {
    name: 'JudgingCategoriesInput',
    expose: [],
    inheritAttrs: false,
  }
</script>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, toRefs, watch } from 'vue'
  import JudgingCategoriesEmptyState from '@/components/JudgingCategoriesEmptyState.vue'
  import JudgingCategoriesInputTable from '@/components/JudgingCategoriesInputTable.vue'
  import JudgingCategoryFormFields from '@/components/JudgingCategoryFormFields.vue'
  import MenuItemConfirm from '@/components/MenuItemConfirm.vue'
  import TrashConfirm from '@/components/TrashConfirm.vue'
  import { useApi, useShowModal } from '@/compositions'
  import { VotingCategory } from '@/models'
  import { VotingCategoryRequest } from '@/models/api'

  const props = defineProps<{
    eventId: string,
  }>()

  const { eventId } = toRefs(props)
  const api = useApi()
  const { showModal, open, close } = useShowModal()
  const { validate, pending } = useValidationObserver()


  const selectedCategories = ref<string[]>([])
  const categoryFormValues = ref<VotingCategoryRequest | VotingCategory>({})

  const votingCategoriesSubscription = useSubscription(api.votingCategories.getVotingCategories, [eventId])
  const votingCategories = computed(() => votingCategoriesSubscription.response ?? [])

  function isVotingCategory(values: VotingCategoryRequest | VotingCategory): values is VotingCategory {
    return 'votingCategoryId' in values && !!values.votingCategoryId
  }

  const modalTitle = computed(() => isVotingCategory(categoryFormValues.value) ? 'Update Category' : 'Add Category')

  async function saveCategoryForm(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    if (isVotingCategory(categoryFormValues.value)) {
      await api.votingCategories.updateVotingCategory(categoryFormValues.value)

      showToast('Judging Category Updated!', 'success')
    } else {
      await api.votingCategories.createVotingCategory(categoryFormValues.value)

      showToast('Judging Category Added!', 'success')
    }

    votingCategoriesSubscription.refresh()

    close()
  }

  async function suggestCategories(): Promise<void> {
    await api.votingCategories.suggestVotingCategories(eventId.value)
    votingCategoriesSubscription.refresh()
  }

  async function deleteAll(): Promise<void> {
    await api.votingCategories.deleteAllVotingCategories(eventId.value)
    votingCategoriesSubscription.refresh()
  }

  async function deleteSelectedCategory(): Promise<void> {
    if (isVotingCategory(categoryFormValues.value)) {
      await deleteCategory(categoryFormValues.value)
      close()
    }
  }

  async function deleteCategory({ votingCategoryId }: VotingCategory): Promise<void> {
    await api.votingCategories.deleteVotingCategory(votingCategoryId)
    votingCategoriesSubscription.refresh()
  }

  function editCategory(votingCategory: VotingCategory): void {
    categoryFormValues.value = { ...votingCategory }

    open()
  }

  async function deleteSelected(): Promise<void> {
    const promises = selectedCategories.value.map(category => api.votingCategories.deleteVotingCategory(category))

    await Promise.all(promises)

    clearSelected()

    votingCategoriesSubscription.refresh()
  }

  function clearSelected(): void {
    selectedCategories.value = []
  }

  watch(showModal, (value) => {
    if (!value) {
      categoryFormValues.value = {}
    }
  })
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

.judging-category-input__modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.judging-category-input__modal-delete-button {
  width: 100%;
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