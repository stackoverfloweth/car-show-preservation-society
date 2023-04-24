<template>
  <p-label class="judging-categories-input-form">
    <template #label>
      <div>Judging Categories</div>
      <div class="judging-categories-input-form__actions">
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
          <p-button class="judging-categories-input-form__add-button" @click="open">
            Add Category
          </p-button>
          <p-icon-button-menu>
            <p-overflow-menu-item class="judging-categories-input-form__add-menu-icon" icon="PlusIcon" label="Add Category" @click="open" />
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
    <JudgingCategoriesInputList
      v-model:selected="selectedCategories"
      :categories="votingCategories"
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
        <DangerAreaConfirm :confirm-text="`Are you sure you want to delete ${categoryFormValues.name}?`" @confirmed="deleteCategory">
          <template #target="{ open: openConfirm }">
            <p-link class="judging-category-input__modal-delete-link" danger @click="openConfirm">
              Delete Category
            </p-link>
          </template>
        </DangerAreaConfirm>
      </template>

      <div class="judging-category-input__modal-actions">
        <p-button inset @click="close">
          Cancel
        </p-button>
        <p-button type="submit" :loading="pending">
          Save
        </p-button>
      </div>
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
  import DangerAreaConfirm from '@/components/DangerAreaConfirm.vue'
  import JudgingCategoriesEmptyState from '@/components/JudgingCategoriesEmptyState.vue'
  import JudgingCategoriesInputList from '@/components/JudgingCategoriesInputList.vue'
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


  const selectedCategories = ref<VotingCategory[]>([])
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

  async function deleteCategory(): Promise<void> {
    if (isVotingCategory(categoryFormValues.value)) {
      await api.votingCategories.deleteVotingCategory(categoryFormValues.value.votingCategoryId)

      votingCategoriesSubscription.refresh()

      close()
    }
  }

  function editCategory(votingCategory: VotingCategory): void {
    categoryFormValues.value = { ...votingCategory }

    open()
  }

  async function deleteSelected(): Promise<void> {
    const promises = selectedCategories.value.map(category => api.votingCategories.deleteVotingCategory(category.votingCategoryId))

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
.judging-categories-input-form .p-label__label {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: start;
}

.judging-categories-input-form__actions {
  display: flex;
  gap: var(--space-3);
}

.judging-categories-input-form__add-menu-icon {
  display: none;
}

.judging-category-input__modal-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.judging-category-input__modal-delete-link {
  color: var(--red-600);
}

@media(max-width: 768px){
  .judging-categories-input-form__add-button {
    display: none;
  }

  .judging-categories-input-form__add-menu-icon {
    display: flex;
  }

  .judging-category-input__modal-actions {
    flex-direction: column;
  }
}
</style>