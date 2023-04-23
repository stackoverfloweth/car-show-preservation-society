<template>
  <div class="judging-category-select">
    <template v-if="votingCategoriesCurrentlySelected.length">
      <JudgingCategoriesList :categories="votingCategoriesCurrentlySelected" role="button" @click="open" />
    </template>
    <p-link @click="open">
      Set Voting Category
    </p-link>
    <p-modal v-model:showModal="showModal" title="Select Judging Category" auto-close>
      <JudgingCategoriesList
        :selected="selectedVotingCategories"
        class="judging-category-select__category-list"
        :categories="availableVotingCategories"
        @update:selected="setSelectedToMaxSelfCategorizationCount"
      />
      <div class="judging-category-select__actions">
        <p-button inset @click="close">
          Cancel
        </p-button>
        <p-button @click="confirmSelectedCategories">
          Confirm Selection
        </p-button>
      </div>
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import JudgingCategoriesList from '@/components/JudgingCategoriesList.vue'
  import { useApi, useShowModal } from '@/compositions'
  import { Event, VotingCategory } from '@/models'

  const props = defineProps<{
    event: Event,
    votingCategoryIds: string[],
  }>()

  const emit = defineEmits<{
    (event: 'update:votingCategoryIds', value: string[]): void,
  }>()

  const votingCategoryIds = computed({
    get() {
      return props.votingCategoryIds
    },
    set(value) {
      emit('update:votingCategoryIds', value)
    },
  })

  const api = useApi()
  const { showModal, open, close } = useShowModal()
  const eventId = computed(() => props.event.eventId)

  const votingCategoriesSubscription = useSubscription(api.votingCategories.getVotingCategories, [eventId])
  const votingCategories = computed(() => votingCategoriesSubscription.response ?? [])
  const availableVotingCategories = computed(() => votingCategories.value.filter(category => !category.automaticEntry))
  const votingCategoriesCurrentlySelected = computed(() => votingCategories.value.filter(category => votingCategoryIds.value.includes(category.votingCategoryId)))

  const selectedVotingCategories = ref<VotingCategory[]>([])

  function confirmSelectedCategories(): void {
    votingCategoryIds.value = selectedVotingCategories.value.map(({ votingCategoryId }) => votingCategoryId)
    close()
  }

  function setSelectedToMaxSelfCategorizationCount(value: VotingCategory[]): void {
    selectedVotingCategories.value = value.slice(props.event.maxSelfCategorization * -1)
  }
</script>

<style>
.judging-category-select__category-list {
  max-height: 70vh;
  overflow-y: auto;
}

.judging-category-select__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
}

@media(max-width: 768px){
  .judging-category-select__actions {
    flex-direction: column;
  }
}
</style>