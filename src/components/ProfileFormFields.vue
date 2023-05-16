<template>
  <div class="profile-form-fields">
    <div class="profile-form-fields__column">
      <p-label label="First Name" :message="firstNameError" :state="firstNameState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="firstName" :state="firstNameState" />
        </template>
      </p-label>

      <p-label label="Last Name" :message="lastNameError" :state="lastNameState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="lastName" :state="lastNameState" />
        </template>
      </p-label>

      <p-label label="Display Name">
        <template #description>
          By default, other users will see your full name associated with your profile. If you'd prefer to have that information kept secret, or you want to go by another name, provide a display name here.
        </template>
        <template #default="{ id }">
          <p-text-input :id="id" v-model="displayNameOverride" :placeholder="`${firstName ?? ''} ${lastName ?? ''}`" />
        </template>
      </p-label>
    </div>

    <div class="profile-form-fields__column">
      <p-label label="Email Address">
        <template #default="{ id }">
          <p-text-input :id="id" disabled :model-value="currentUser().emailAddress" />
        </template>
      </p-label>

      <p-label label="Hide Email Address">
        <template #description>
          Opt out of having your email address be displayed on your public profile.
        </template>
        <template #default="{ id }">
          <p-toggle :id="id" v-model="hideEmailAddress" />
        </template>
      </p-label>

      <p-label label="Phone Number" :message="phoneNumberError" :state="phoneNumberState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="phoneNumber" :state="phoneNumberState" />
        </template>
      </p-label>

      <p-label label="Hide Phone Number">
        <template #description>
          Opt out of having your phone number be displayed on your public profile.
        </template>
        <template #default="{ id }">
          <p-toggle :id="id" v-model="hidePhoneNumber" />
        </template>
      </p-label>
    </div>

    <div class="profile-form-fields__column">
      <div class="profile-form-fields__location">
        <p-label label="Location" :message="locationError" :state="locationState" />
        <LocationInput v-model:location="location" :state="locationState" />
      </div>

      <p-label label="Hide Location">
        <template #description>
          Opt out of having your location be displayed on your public profile.
        </template>
        <template #default="{ id }">
          <p-toggle :id="id" v-model="hideLocation" />
        </template>
      </p-label>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import LocationInput from '@/components/LocationInput.vue'
  import { UserAttributes } from '@/models/api'
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    values: UserAttributes,
  }>()

  const emit = defineEmits<{
    (vehicle: 'update:values', value: UserAttributes): void,
  }>()

  const user = computed({
    get() {
      return { ...props.values }
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const firstName = usePatchRef(user, 'firstName')
  const lastName = usePatchRef(user, 'lastName')
  const phoneNumber = usePatchRef(user, 'phoneNumber')
  const location = usePatchRef(user, 'location')
  const displayNameOverride = usePatchRef(user, 'displayNameOverride')
  const hideEmailAddress = usePatchRef(user, 'hideEmailAddress')
  const hidePhoneNumber = usePatchRef(user, 'hidePhoneNumber')
  const hideLocation = usePatchRef(user, 'hidePhoneNumber')

  const { error: firstNameError, state: firstNameState } = useValidation(firstName, 'First Name', [])
  const { error: lastNameError, state: lastNameState } = useValidation(lastName, 'Last Name', [])
  const { error: phoneNumberError, state: phoneNumberState } = useValidation(phoneNumber, 'Phone Number', [])
  const { error: locationError, state: locationState } = useValidation(location, 'Location', [])
</script>

<style>
.profile-form-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-lg);
  row-gap: var(--space-md);
}

.profile-form-fields__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
</style>