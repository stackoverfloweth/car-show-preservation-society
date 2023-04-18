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

      <p-label label="Email Address" :message="emailAddressError" :state="emailAddressState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="emailAddress" :state="emailAddressState" />
        </template>
      </p-label>

      <p-label label="Phone Number" :message="phoneNumberError" :state="phoneNumberState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="phoneNumber" :state="phoneNumberState" />
        </template>
      </p-label>
    </div>

    <div class="profile-form-fields__column">
      <div class="profile-form-fields__location">
        <p-label label="Event Location" :message="locationError" :state="locationState" />
        <LocationInput v-model:location="location" :state="locationState" />
      </div>

      <div class="profile-form-fields__image-upload">
        <p-label label="Add Photo" :message="profileImageError" :state="profileImageState" />
        <ImageUpload v-model:image="profileImage" :state="profileImageState" />
      </div>
    </div>

    <div class="profile-form-fields__column">
      <div class="profile-form-fields__image-container">
        <p-label label="Current Photo" />
        <SizedImage class="profile-form-fields__image" :image="profileImage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import LocationInput from '@/components/LocationInput.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { User } from '@/models'

  const props = defineProps<{
    values: User,
  }>()

  const emit = defineEmits<{
    (vehicle: 'update:values', value: User): void,
  }>()

  const user = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const firstName = usePatchRef(user, 'firstName')
  const lastName = usePatchRef(user, 'lastName')
  const emailAddress = usePatchRef(user, 'emailAddress')
  const phoneNumber = usePatchRef(user, 'phoneNumber')
  const location = usePatchRef(user, 'location')
  const profileImage = usePatchRef(user, 'profileImage')

  const { error: firstNameError, state: firstNameState } = useValidation(firstName, 'First Name', [])
  const { error: lastNameError, state: lastNameState } = useValidation(lastName, 'Last Name', [])
  const { error: emailAddressError, state: emailAddressState } = useValidation(emailAddress, 'Email Address', [])
  const { error: phoneNumberError, state: phoneNumberState } = useValidation(phoneNumber, 'Phone Number', [])
  const { error: locationError, state: locationState } = useValidation(location, 'Location', [])
  const { error: profileImageError, state: profileImageState } = useValidation(profileImage, 'Profile Image', [])
</script>

<style>
.profile-form-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.profile-form-fields__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.profile-form-fields__image-upload {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 150px;
}

.profile-form-fields__image {
  padding-top: 82.68%;
}
</style>