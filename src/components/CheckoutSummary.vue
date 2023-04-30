<template>
  <p-card class="checkout-summary">
    <p>Cost</p>
    <ul>
      <li>+ Registration Fee</li>
      <li>+ Optional Fee for Judging categories</li>
      <li>+ Cross Sells</li>
      <li>+ Discount Code</li>
    </ul>
    <p>$50.00</p>

    <template v-if="registration?.stripePaymentId">
      Has Paid
      <p-button inset>
        Download Receipt
      </p-button>
    </template>
    <template v-else>
      <template v-if="canEditEvent">
        <img class="event-register-page__qr-code" src="/qr-example.png">

        <div class="checkout-summary__actions">
          <p-button inset>
            Send Payment Link
          </p-button>
          <template v-if="event.isHappening">
            <p-button @click="open">
              Check-In
            </p-button>
          </template>
        </div>
      </template>

      <template v-else>
        <div class="checkout-summary__actions">
          <template v-if="event.preRegistrationUnpaid">
            <p-button inset>
              Register Without Paying
            </p-button>
          </template>
          <p-button @click="submit">
            Complete Payment
          </p-button>
        </div>
      </template>
    </template>

    <template v-if="registration">
      <CheckInModal v-model:showModal="showModal" :event="event" :registration="registration" />
    </template>
  </p-card>
</template>

<script lang="ts" setup>
  import CheckInModal from '@/components/CheckInModal.vue'
  import { useCanEditEvent, useShowModal } from '@/compositions'
  import { Event, Registration } from '@/models'

  defineProps<{
    event: Event,
    registration?: Registration,
  }>()

  const emit = defineEmits<{
    (event: 'submit'): void,
  }>()

  const canEditEvent = useCanEditEvent()
  const { showModal, open } = useShowModal()

  function submit(): void {
    emit('submit')
  }
</script>

<style>
.checkout-summary {
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.checkout-summary__actions {
  display: flex;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .checkout-summary__actions {
    flex-direction: column;
  }
}
</style>