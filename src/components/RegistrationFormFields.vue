<template>
  <div class="registration-form-fields">
    <p-label label="Vehicle" :state="vehicleIdState" :message="vehicleIdError">
      <VehicleSelect v-model:vehicleId="vehicleId" />
    </p-label>

    <p-label label="Judging Category" :state="selectedVotingCategoriesState" :message="selectedVotingCategoriesError">
      <template v-if="event.driverSelfCategorization">
        <JudgingCategorySelect v-if="votingCategoryIds" v-model:voting-category-ids="votingCategoryIds" :event="event" />
      </template>
      <template v-else>
        <p-message info>
          Judging categories for this event are set by the club members. At some point before voting begins on the day of the event, a club member will assign your entry into it's corresponding category.
        </p-message>
      </template>
    </p-label>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import JudgingCategorySelect from '@/components/JudgingCategorySelect.vue'
  import VehicleSelect from '@/components/VehicleSelect.vue'
  import { Event } from '@/models'
  import { RegistrationRequest } from '@/models/api'

  const props = defineProps<{
    event: Event,
    values: RegistrationRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: RegistrationRequest): void,
  }>()

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

  const { error: vehicleIdError, state: vehicleIdState } = useValidation(vehicleId, 'Vehicle', [])
  const { error: selectedVotingCategoriesError, state: selectedVotingCategoriesState } = useValidation(votingCategoryIds, 'Category', [])
</script>

<style>
.registration-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>