<template>
  <p-modal v-model:showModal="showModal" title="Check In" class="check-in-modal" auto-close>
    <p-key-value label="Registration Status">
      <template #value>
        <div class="check-in-modal__registration-status">
          <template v-if="registration.isCheckedIn && registration.checkInDate">
            Checked in at {{ format(registration.checkInDate, 'pp') }}
          </template>
          <template v-else-if="registration.stripePaymentId">
            <div class="check-in-modal__registration-status-details">
              <div class="check-in-modal__paid-label">
                Paid
              </div>
              $50.24
            </div>
            <div class="check-in-modal__registration-status-actions">
              <p-button inset @click="markAsUnpaid">
                Mark as Unpaid
              </p-button>
            </div>
          </template>
          <template v-else>
            <div class="check-in-modal__registration-status-details">
              <div class="check-in-modal__unpaid-label">
                Payment Due
              </div>
              $50.24
            </div>
            <div class="check-in-modal__registration-status-actions">
              <p-button inset>
                Send Payment Link
              </p-button>
              <p-button inset @click="markAsPaid">
                Mark as Paid
              </p-button>
            </div>
          </template>
        </div>
      </template>
    </p-key-value>

    <p-key-value label="Driver">
      <template #value>
        {{ user?.displayName }}
      </template>
    </p-key-value>

    <p-key-value label="Registered Vehicle">
      <template #value>
        {{ vehicle?.year }} {{ vehicle?.make }} {{ vehicle?.model }}
      </template>
    </p-key-value>

    <p-key-value label="Selected Category">
      <template #value>
        <div class="check-in-modal__voting-categories">
          {{ votingCategories.map(category => category.name).join(', ') }}
        </div>
      </template>
    </p-key-value>

    <div class="check-in-modal__actions">
      <p-button inset :to="routes.eventRegistration(event.eventId, registration.registrationId)">
        View Registration
      </p-button>
      <template v-if="event.isHappening && !registration.isCheckedIn">
        <p-button :disabled="!registration.stripePaymentId" @click="completeCheckIn">
          Complete Check In
        </p-button>
      </template>
    </div>
  </p-modal>
</template>

<script lang="ts" setup>
  import { useSubscription, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { format } from 'date-fns'
  import { computed } from 'vue'
  import { useApi } from '@/compositions'
  import { Event, Registration } from '@/models'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    showModal: boolean,
    event: Event,
    registration: Registration,
  }>()

  const emit = defineEmits<{
    (event: 'update:showModal', value: boolean): void,
    (event: 'complete'|'mark-paid'|'mark-unpaid'): void,
  }>()

  const registrationId = computed(() => props.registration.registrationId)

  const api = useApi()

  const showModal = computed({
    get() {
      return props.showModal
    },
    set(value) {
      emit('update:showModal', value)
    },
  })

  const votingCategoriesSubscription = useSubscription(api.votingCategories.getVotingCategoriesByRegistration, [registrationId])
  const votingCategories = computed(() => votingCategoriesSubscription.response ?? [])

  const userSubscriptionArgs = computed<Parameters<typeof api.users.getCurrentUser> | null>(() => {
    if (!props.registration.user) {
      return []
    }

    return null
  })
  const userSubscription = useSubscriptionWithDependencies(api.users.getCurrentUser, userSubscriptionArgs)
  const user = computed(() => props.registration.user ?? userSubscription.response)

  const vehicleSubscriptionArgs = computed<Parameters<typeof api.vehicles.getVehicle> | null>(() => {
    if (!props.registration.vehicle && !!props.registration.vehicleId) {
      return [props.registration.vehicleId]
    }

    return null
  })
  const vehicleSubscription = useSubscriptionWithDependencies(api.vehicles.getVehicle, vehicleSubscriptionArgs)
  const vehicle = computed(() => props.registration.vehicle ?? vehicleSubscription.response)

  function markAsPaid(): void {
    emit('mark-paid')
  }

  function markAsUnpaid(): void {
    emit('mark-unpaid')
  }

  function completeCheckIn(): void {
    emit('complete')
  }
</script>

<style>
.check-in-modal__registration-status {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.check-in-modal__paid-label {
  font-size: var(--text-base-size);
  font-weight: normal;
  color: var(--green-600);
  font-weight: bold;
}

.check-in-modal__unpaid-label {
  font-size: var(--text-base-size);
  font-weight: normal;
  color: var(--red-600);
  font-weight: bold;
}

.check-in-modal__registration-status-details {
  font-size: var(--text-lg);
  white-space: nowrap;
}

.check-in-modal__registration-status-actions,
.check-in-modal__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width:768px){
  .check-in-modal__actions {
    flex-direction: column;
  }
}
</style>