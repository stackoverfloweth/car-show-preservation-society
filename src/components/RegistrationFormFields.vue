<template>
  <div class="registration-form-fields">
    <div class="registration-form-fields__column">
      <template v-if="event.driverSelfCategorization">
        <p-label label="Judging Category" :state="selectedVotingCategoriesState" :message="selectedVotingCategoriesError" role="button" @click="openJudgingCategoryModal">
          <template v-if="votingCategoriesCurrentlySelected.length">
            <JudgingCategoriesList :categories="votingCategoriesCurrentlySelected" />
          </template>
          <template v-else>
            <p-button @click="openJudgingCategoryModal">
              Set Voting Category
            </p-button>
          </template>
        </p-label>
      </template>
      <template v-else>
        <p-message info>
          Judging categories for this event are set by the club members. At some point before voting begins on the day of the event, a club member will assign your entry into it's corresponding category.
        </p-message>
      </template>
    </div>
    <p-modal v-model:showModal="showJudgingCategoryModal" title="Select Judging Category" auto-close>
      <JudgingCategoriesList :selected="selectedVotingCategories" class="registration-form-fields__judging-categories" :categories="votingCategories" @update:selected="setSelectedToMaxSelfCategorizationCount" />
      <div class="registration-form-fields__judging-category-actions">
        <p-button inset @click="closeJudgingCategoryModal">
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
  import { usePatchRef, useSubscription, useValidation } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import JudgingCategoriesList from '@/components/JudgingCategoriesList.vue'
  import { useApi, useShowModal } from '@/compositions'
  import { Event, VotingCategory } from '@/models'
  import { RegistrationRequest } from '@/models/api'

  const props = defineProps<{
    event: Event,
    values: RegistrationRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: RegistrationRequest): void,
  }>()

  // consider preRegistrationUnpaid

  const api = useApi()
  const eventId = computed(() => props.event.eventId)
  const { showModal: showJudgingCategoryModal, open: openJudgingCategoryModal, close: closeJudgingCategoryModal } = useShowModal()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const vehicleId = usePatchRef(values, 'vehicleId')
  const votingCategoryIds = usePatchRef(values, 'votingCategoryIds')

  const selectedVotingCategories = ref<VotingCategory[]>([])

  function confirmSelectedCategories(): void {
    votingCategoryIds.value = selectedVotingCategories.value.map(({ votingCategoryId }) => votingCategoryId)
    closeJudgingCategoryModal()
  }

  function setSelectedToMaxSelfCategorizationCount(value: VotingCategory[]): void {
    selectedVotingCategories.value = value.slice(props.event.maxSelfCategorization * -1)
  }

  const { error: vehicleIdError, state: vehicleIdState } = useValidation(vehicleId, 'Vehicle', [])
  const { error: selectedVotingCategoriesError, state: selectedVotingCategoriesState } = useValidation(selectedVotingCategories, 'Category', [])

  const votingCategoriesSubscription = useSubscription(api.votingCategories.getVotingCategories, [eventId])
  const votingCategories = computed(() => votingCategoriesSubscription.response ?? [])
  const votingCategoriesCurrentlySelected = computed(() => votingCategories.value.filter(category => votingCategoryIds.value?.includes(category.votingCategoryId)))
</script>

<style>
.registration-form-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.registration-form-fields__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.registration-form-fields__judging-categories {
  max-height: 75vh;
  overflow-y: auto;
}

.registration-form-fields__judging-category-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
}

@media(max-width: 768px){
  .registration-form-fields__judging-category-actions {
    flex-direction: column;
  }
}
</style>