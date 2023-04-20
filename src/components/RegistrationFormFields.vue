<template>
  <div class="registration-form-fields">
    <template v-if="event.driverSelfCategorization">
      <p-label label="Judging Category" :state="selectedVotingCategoriesState" :message="selectedVotingCategoriesError">
        <JudgingCategoriesTable v-model:selected="selectedVotingCategories" :categories="votingCategories" />
      </p-label>
    </template>
    <template v-else>
      <p-message info>
        Judging categories for this event are set by the club members. At some point before voting begins on the day of the event, a club member will assign your entry into it's corresponding category.
      </p-message>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useSubscription, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import JudgingCategoriesTable from '@/components/JudgingCategoriesTable.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'
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

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const vehicleId = usePatchRef(values, 'vehicleId')

  const selectedVotingCategories = computed({
    get() {
      return values.value.votingCategoryIds ?? []
    },
    set(value) {
      values.value = {
        ...values.value,
        votingCategoryIds: takeOnlyUpToMaxSelfCategorizationCount(value),
      }
    },
  })

  function takeOnlyUpToMaxSelfCategorizationCount(value: string[]): string[] {
    return value.slice(props.event.maxSelfCategorization * -1)
  }

  const { error: vehicleIdError, state: vehicleIdState } = useValidation(vehicleId, 'Vehicle', [])
  const { error: selectedVotingCategoriesError, state: selectedVotingCategoriesState } = useValidation(selectedVotingCategories, 'Category', [])

  const votingCategoriesSubscription = useSubscription(api.votingCategories.getVotingCategories, [eventId])
  const votingCategories = computed(() => votingCategoriesSubscription.response ?? [])
</script>