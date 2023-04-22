<template>
  <div class="registration-page">
    <template v-if="event">
      <div class="registration-page__column">
        <EventHeader :event="event" @club:click="openRelatedClub" />

        <template v-if="existingRegistration">
          <p-label label="Selected Vehicle">
            <VehicleIdCard v-if="existingRegistration.vehicleId" :vehicle-id="existingRegistration.vehicleId" />
          </p-label>

          <p-label label="Judging Category">
            <JudgingCategoriesList :categories="existingRegistration.votingCategories" />
          </p-label>
        </template>
        <template v-else>
          <p-form v-if="canEditEvent" class="registration-page__form" @submit="submitNewUserRegistration">
            <RegistrationNewUserFormFields v-model:values="registrationNewUserValues" :event="event" />
          </p-form>

          <p-form v-else class="registration-page__form" @submit="submitRegistration">
            <RegistrationFormFields v-model:values="registrationValues" :event="event" />
          </p-form>
        </template>
      </div>

      <div class="registration-page__column">
        <template v-if="existingRegistration">
          <img class="registration-page__qr-code" src="/qr-example.png">
        </template>
        <template v-else>
          <p-card class="registration-page__checkout">
            <p>Cost</p>
            <ul>
              <li>+ Registration Fee</li>
              <li>+ Optional Fee for Judging categories</li>
              <li>+ Cross Sells</li>
              <li>+ Discount Code</li>
            </ul>
            <p>$50.00</p>

            <div class="registration-page__checkout-actions">
              <template v-if="event.preRegistrationUnpaid">
                <p-button inset>
                  Register Without Paying
                </p-button>
              </template>
              <p-button>Complete Payment</p-button>
            </div>
          </p-card>
        </template>
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
  import ClubOverview from '@/components/ClubOverview.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import JudgingCategoriesList from '@/components/JudgingCategoriesList.vue'
  import RegistrationFormFields from '@/components/RegistrationFormFields.vue'
  import RegistrationNewUserFormFields from '@/components/RegistrationNewUserFormFields.vue'
  import VehicleIdCard from '@/components/VehicleIdCard.vue'
  import { useApi, useCanEditEvent, useNavigation, useShowModal } from '@/compositions'
  import { Registration } from '@/models'
  import { RegistrationRequest, NewUserRegistrationRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services/auth'
  import { isRegistered } from '@/services/registrationApi'

  const api = useApi()
  const eventId = useRouteParam('eventId')
  useNavigation({
    left: { title: 'Event', route: routes.event(eventId.value) },
    center: { title: 'Event Registration' },
  })
  const { validate } = useValidationObserver()
  const canEditEvent = useCanEditEvent()
  const { showModal: showClubModal, open: openRelatedClub } = useShowModal()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const clubSubscriptionDependencies = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value ? [event.value.clubId] : null)
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

    await api.registration.createRegistration(registrationValues.value)

    showToast('Registered!', 'success')

    // todo: this is demo only
    isRegistered.value = true

    registrationSubscription.refresh()
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
.registration-page {
  --num-cols: 2;
  display: grid;
  grid-template-columns: repeat(var(--num-cols), minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
  flex-grow: 1;
  padding: var(--space-4);
}

.registration-page__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.registration-page__checkout {
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.registration-page__checkout-actions {
  display: flex;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .registration-page {
    --num-cols: 1;
  }
}
</style>