<template>
  <div class="event-registration-page">
    <template v-if="event">
      <EventHeader :event="event" @club:click="openRelatedClub" />

      <div class="event-registration-page__columns">
        <div class="event-registration-page__column">
          <template v-if="registration?.isCheckedIn">
            <p-message info>
              You're Checked In!
            </p-message>

            <template v-if="event.votingOpen">
              <p-card>
                <PageHeader heading="Voting Is Open" />
                <div class="event-registration-page__voting-times">
                  {{ format(event.votingEnd ?? event.end, 'pp') }}
                </div>
              </p-card>
            </template>
            <template v-else>
              <p-card>
                <PageHeader heading="Voting Opens Soon" />
                <div class="event-registration-page__voting-times">
                  {{ format(event.votingStart ?? event.start, 'pp') }}
                </div>
              </p-card>
            </template>
          </template>

          <template v-else>
            <img class="event-registration-page__qr-code" src="/qr-example.png">
          </template>
        </div>

        <div class="event-registration-page__column">
          <template v-if="registration?.isCheckedIn">
            <EventBallots :event="event" />
          </template>

          <template v-else-if="registration">
            <p-form @submit="updateRegistration">
              <RegistrationFormFields v-model:values="registrationValues" :event="event" />
            </p-form>

            <CheckoutSummary :event="event" :registration="registration" />
          </template>
        </div>
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
  import { format } from 'date-fns'
  import { computed, ref, watch } from 'vue'
  import CheckoutSummary from '@/components/CheckoutSummary.vue'
  import ClubOverview from '@/components/ClubOverview.vue'
  import EventBallots from '@/components/EventBallots.vue'
  import EventHeader from '@/components/EventHeader.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import RegistrationFormFields from '@/components/RegistrationFormFields.vue'
  import { useApi, useNavigation, useShowModal } from '@/compositions'
  import { RegistrationRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { currentIdentity } from '@/services/auth'
  import { mapper } from '@/services/mapper'

  const api = useApi()
  const eventId = useRouteParam('eventId')
  const registrationId = useRouteParam('registrationId')

  const { validate, pending } = useValidationObserver()
  const { showModal: showClubModal, open: openRelatedClub } = useShowModal()

  const registrationValues = ref<RegistrationRequest>({ eventId: eventId.value, userId: currentIdentity(), votingCategoryIds: [] })

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const registrationSubscription = useSubscription(api.registration.getRegistration, [registrationId])
  const registration = computed(() => registrationSubscription.response)

  const clubSubscriptionDependencies = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value && showClubModal.value ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionDependencies)
  const club = computed(() => clubSubscription.response)

  async function updateRegistration(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.registration.updateRegistration(registrationValues.value)

    showToast('Registration Updated!', 'success')

    registrationSubscription.refresh()
  }

  watch(registration, value => {
    if (value) {
      registrationValues.value = mapper.map('Registration', value, 'RegistrationRequest')
    }
  })

  useNavigation({
    left: { title: 'Event', route: routes.event(eventId.value) },
    right: { title: 'Save', pending: pending.value, callback: updateRegistration },
  })
</script>

<style>
.event-registration-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-md);
  gap: var(--space-lg);
}

.event-registration-page__columns {
  --num-cols: 2;
  display: grid;
  grid-template-columns: repeat(var(--num-cols), minmax(0, 1fr));
  gap: var(--space-md);
}

.event-registration-page__column {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md)
}

.event-registration-page__voting-times {
  flex-grow: 1;
  font-size: var(--text-lg);
  white-space: nowrap;
}

@media(max-width: 768px) {
  .event-registration-page__columns {
    --num-cols:1;
  }
}
</style>