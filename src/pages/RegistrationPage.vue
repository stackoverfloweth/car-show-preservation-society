<template>
  <div class="registration-page">
    <EventHeader v-if="event" :event="event" @club:click="openRelatedClub" />

    <template v-if="existingRegistration">
      show existing registration
    </template>

    <template v-else-if="event">
      <p-form class="registration-page__form" @submit="submitNewRegistration">
        <RegistrationFormFields v-model:values="newRegistration" :event="event" />
      </p-form>
    </template>

    <p-modal v-model:show-modal="showClubModal" :title="club?.name" auto-close>
      <template v-if="club">
        <ClubOverview :club="club" />
      </template>
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription, useSubscriptionWithDependencies, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, watch, watchEffect } from 'vue'
  import ClubOverview from '@/components/ClubOverview.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import RegistrationFormFields from '@/components/RegistrationFormFields.vue'
  import { useApi, useNavigation, useShowModal } from '@/compositions'
  import { Registration } from '@/models'
  import { RegistrationRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services/auth'
  import { isRegistered } from '@/services/registrationApi'

  const api = useApi()
  const eventId = useRouteParam('eventId')
  const { set } = useNavigation()
  const { validate } = useValidationObserver()
  const { showModal: showClubModal, open: openRelatedClub } = useShowModal()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const clubSubscriptionDependencies = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionDependencies)
  const club = computed(() => clubSubscription.response)

  const registrationSubscription = useSubscription(api.registration.findRegistration, [eventId, currentUser.userId])
  watch(() => registrationSubscription.response, value => {
    if (value) {
      existingRegistration.value = value
    }
  })

  const existingRegistration = ref<Registration>()
  const newRegistration = ref<RegistrationRequest>({ eventId: eventId.value, userId: currentUser.userId, votingCategoryIds: [] })

  async function submitNewRegistration(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.registration.createRegistration(newRegistration.value)

    showToast('Registered!', 'success')

    // todo: this is demo only
    isRegistered.value = true

    registrationSubscription.refresh()
  }

  watchEffect(() => {
    const left = { title: 'Event', route: routes.event(eventId.value) }

    set({ left })
  })
</script>

<style>
.registration-page {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
}
</style>