<template>
  <div class="registration-form-fields">
    <p-label label="Email Address" :message="emailAddressError" :state="emailAddressState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="emailAddress" :state="emailAddressState" />
      </template>
    </p-label>

    <!--
      <p-label label="Phone Number" :message="phoneNumberError" :state="phoneNumberState">
      <template #default="{ id }">
      <p-text-input :id="id" v-model="phoneNumber" :state="phoneNumberState" />
      </template>
      </p-label>
    -->

    <template v-if="existingUser">
      <ContactCard :user="existingUser" show-details />
      <VehicleSelect v-model:vehicleId="vehicleId" />
    </template>
    <template v-else>
      <p-label label="Year" :message="yearError" :state="yearState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="year" :state="yearState" />
        </template>
      </p-label>

      <p-label label="Make" :message="makeError" :state="makeState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="make" :state="makeState" />
        </template>
      </p-label>

      <p-label label="Model" :message="modelError" :state="modelState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="model" :state="modelState" />
        </template>
      </p-label>

      <p-label label="Color" :message="colorError" :state="colorState">
        <template #description>
          Exterior body primary paint color
        </template>
        <template #default="{ id }">
          <p-text-input :id="id" v-model="color" :state="colorState" />
        </template>
      </p-label>
    </template>

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
  import { useDebouncedRef, usePatchRef, useSubscriptionWithDependencies, useValidation } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import ContactCard from '@/components/ContactCard.vue'
  import JudgingCategorySelect from '@/components/JudgingCategorySelect.vue'
  import VehicleSelect from '@/components/VehicleSelect.vue'
  import { useApi } from '@/compositions'
  import { Event, User } from '@/models'
  import { NewUserRegistrationRequest } from '@/models/api'

  const props = defineProps<{
    event: Event,
    values: NewUserRegistrationRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: NewUserRegistrationRequest): void,
  }>()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const api = useApi()
  const emailAddress = usePatchRef(values, 'emailAddress')
  const vehicleId = usePatchRef(values, 'vehicleId')
  const vehicle = usePatchRef(values, 'vehicle')
  const votingCategoryIds = usePatchRef(values, 'votingCategoryIds')

  const make = usePatchRef(vehicle, 'make')
  const model = usePatchRef(vehicle, 'model')
  const year = usePatchRef(vehicle, 'year')
  const color = usePatchRef(vehicle, 'color')

  const { error: emailAddressError, state: emailAddressState } = useValidation(emailAddress, 'Email Address', [])
  const { error: makeError, state: makeState } = useValidation(make, 'Make', [])
  const { error: modelError, state: modelState } = useValidation(model, 'Model', [])
  const { error: yearError, state: yearState } = useValidation(year, 'Year', [])
  const { error: colorError, state: colorState } = useValidation(color, 'Color', [])
  const { error: selectedVotingCategoriesError, state: selectedVotingCategoriesState } = useValidation(votingCategoryIds, 'Category', [])

  // todo: rework after user comes from netlify
  const existingUser = ref<User>()

  // const existingUserSubscriptionArgs = ref<Parameters<typeof api.users.findUser> | null>(null)
  // const existingUserSubscription = useSubscriptionWithDependencies(api.users.findUser, existingUserSubscriptionArgs)
  // const existingUser = computed(() => existingUserSubscription.response)

  // const emailAddressDebounced = useDebouncedRef(emailAddress, 750)
  // const phoneNumberDebounced = useDebouncedRef(phoneNumber, 750)

  // watch([emailAddressDebounced, phoneNumberDebounced], ([emailAddress, phoneNumber]) => {
  //   if (!emailAddress && !phoneNumber) {
  //     return existingUserSubscriptionArgs.value = null
  //   }

  //   if (existingUser.value) {
  //     return
  //   }

  //   existingUserSubscriptionArgs.value = [{ emailAddress, phoneNumber }]
  // })
</script>

<style>
.registration-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
</style>