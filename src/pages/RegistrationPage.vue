<template>
  <div class="registration-page">
    <template v-if="existingRegistration">
      show existing registration
    </template>

    <template v-else>
      <p-form @submit="submitNewRegistration">
        <RegistrationFormFields :values="newRegistration" />
      </p-form>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import RegistrationFormFields from '@/components/RegistrationFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { Registration } from '@/models'
  import { RegistrationRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services/auth'

  const api = useApi()
  const { set } = useNavigation()
  const eventId = useRouteParam('eventId')
  const { validate, pending } = useValidationObserver()

  const registrationSubscription = useSubscription(api.registration.findRegistration, [eventId, currentUser.userId])
  registrationSubscription.promise()
    .then(({ response }) => {
      if (response) {
        existingRegistration.value = response
      }
    })

  const existingRegistration = ref<Registration>()
  const newRegistration = ref<RegistrationRequest>({ eventId: eventId.value, userId: currentUser.userId })

  async function submitNewRegistration(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.registration.createRegistration(newRegistration.value)

    showToast('Registered!', 'success')
  }

  async function updateRegistration(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !existingRegistration.value) {
      return
    }

    await api.registration.updateRegistration(existingRegistration.value)

    showToast('Registered!', 'success')
  }

  watchEffect(() => {
    const left = { title: 'Event', route: routes.event(eventId.value) }
    const right = existingRegistration.value
      ? { title: 'Save', pending: pending.value, callback: updateRegistration }
      : { title: 'Register', pending: pending.value, callback: submitNewRegistration }

    set({ left, right })
  })
</script>

<style>
.registration-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
}
</style>