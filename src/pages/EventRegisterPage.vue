<template>
  <div class="event-register-page">
    <template v-if="event">
      <div class="event-register-page__column">
        <EventHeader :event="event" @club:click="openRelatedClub" />

        <template v-if="canEditEvent">
          <p-form class="event-register-page__form" @submit="submitNewUserRegistration">
            <RegistrationNewUserFormFields v-model:values="registrationNewUserValues" :event="event" />
          </p-form>
        </template>
        <template v-else>
          <p-link v-if="existingRegistration" :to="routes.eventRegistration(event.eventId, existingRegistration.registrationId)">
            View Registration
          </p-link>

          <p-form v-else class="event-register-page__form" @submit="submitRegistration">
            <RegistrationFormFields v-model:values="registrationValues" :event="event" />
          </p-form>
        </template>
      </div>

      <div class="event-register-page__column">
        <CheckoutSummary :event="event" />
      </div>
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
  import { computed, ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import ClubOverview from '@/components/ClubOverview.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import RegistrationFormFields from '@/components/RegistrationFormFields.vue'
  import RegistrationNewUserFormFields from '@/components/RegistrationNewUserFormFields.vue'
  import { useApi, useCanEditEvent, useNavigation, useShowModal } from '@/compositions'
  import { Registration } from '@/models'
  import { RegistrationRequest, NewUserRegistrationRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services/auth'
  import { isRegistered } from '@/services/registrationApi'

  const api = useApi()
  const eventId = useRouteParam('eventId')
  const router = useRouter()
  useNavigation({
    left: { title: 'Event', route: routes.event(eventId.value) },
    center: { title: 'Event Registration' },
  })
  const { validate } = useValidationObserver()
  const canEditEvent = useCanEditEvent()
  const { showModal: showClubModal, open: openRelatedClub } = useShowModal()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const clubSubscriptionDependencies = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value && showClubModal.value ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionDependencies)
  const club = computed(() => clubSubscription.response)

  const existingRegistration = ref<Registration>()
  const registrationSubscription = useSubscription(api.registration.findRegistration, [eventId, currentUser.userId])
  watchEffect(() => {
    existingRegistration.value = registrationSubscription.response
  })

  const registrationNewUserValues = ref<NewUserRegistrationRequest>({ eventId: eventId.value, user: {}, vehicle: {}, votingCategoryIds: [] })
  const registrationValues = ref<RegistrationRequest>({ eventId: eventId.value, userId: currentUser.userId, votingCategoryIds: [] })

  async function submitNewUserRegistration(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const registration = await api.registration.createRegistration(registrationValues.value)

    showToast('Registered!', 'success')

    // todo: this is demo only
    isRegistered.value = true

    router.push(routes.eventRegistration(eventId.value, registration.registrationId))
  }

  async function submitRegistration(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.registration.createRegistration(registrationValues.value)

    showToast('Registered!', 'success')

    // todo: this is demo only
    isRegistered.value = true

    registrationSubscription.refresh()
  }
</script>

<style>
.event-register-page {
  --num-cols: 2;
  display: grid;
  grid-template-columns: repeat(var(--num-cols), minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
  flex-grow: 1;
  padding: var(--space-4);
}

.event-register-page__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

@media(max-width: 768px){
  .event-register-page {
    --num-cols: 1;
  }
}
</style>