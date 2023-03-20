<template>
  <div class="event-registration-form-fields">
    <div class="event-registration-form-fields__left">
      <p-label label="Registration Price" :message="priceError" :state="priceState">
        <template #default="{ id }">
          <div class="event-judging-form-fields__tip">
            Optional, this is the full registration price participants will pay at the gate.
          </div>
          <PriceInput :id="id" v-model="price" :state="priceState" />
        </template>
      </p-label>

      <p-label label="Pre-Registration">
        <template #default="{ id }">
          <div v-if="preRegistration" class="event-registration-form-fields__tip">
            Participants can pre-register for this event as soon as this event as it's published.
          </div>
          <div v-else class="event-registration-form-fields__tip">
            Participants can <strong>NOT</strong> pre-register for this event ahead of time. All participants will be registered at the gate.
          </div>
          <p-toggle :id="id" v-model="preRegistration" />
        </template>
      </p-label>

      <template v-if="preRegistration">
        <p-label label="Pre-Registration Price" :message="preRegistrationPriceError" :state="preRegistrationPriceState">
          <template #default="{ id }">
            <div class="event-judging-form-fields__tip">
              Optional, if provided this will be the price that participants pay to pre-register for the event online.
            </div>
            <PriceInput :id="id" v-model="preRegistrationPrice" :state="preRegistrationPriceState" />
          </template>
        </p-label>

        <p-label label="Pay at the Gate / Pay Cash">
          <template #default="{ id }">
            <div v-if="preRegistrationUnpaid" class="event-registration-form-fields__tip">
              Participants can pre-register for this event without making payment.
            </div>
            <div v-else class="event-registration-form-fields__tip">
              Participants must complete payment online in order to pre-register for this event.
            </div>
            <p-toggle :id="id" v-model="preRegistrationUnpaid" />
          </template>
        </p-label>

        <p-label label="Maximum Slots" :message="maxCapacityError" :state="maxCapacityState">
          <template #default="{ id }">
            <div class="event-registration-form-fields__tip">
              Optional, maximum number of pre-registrations accepted for this event.
            </div>
            <p-number-input :id="id" v-model="maxCapacity" :state="maxCapacityState" />
          </template>
        </p-label>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import PriceInput from '@/components/PriceInput.vue'
  import { EventRequest } from '@/models/api'

  const props = defineProps<{
    values: Partial<EventRequest>,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: Partial<EventRequest>): void,
  }>()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const price = usePatchRef(values, 'priceInPennies')
  const preRegistration = usePatchRef(values, 'preRegistration')
  const preRegistrationUnpaid = usePatchRef(values, 'preRegistrationUnpaid')
  const maxCapacity = usePatchRef(values, 'maxCapacity')
  const preRegistrationPrice = usePatchRef(values, 'preRegistrationPriceInPennies')

  const { error: priceError, state: priceState } = useValidation(price, 'Price', [])
  const { error: maxCapacityError, state: maxCapacityState } = useValidation(maxCapacity, 'Maximum Slots', [])
  const { error: preRegistrationPriceError, state: preRegistrationPriceState } = useValidation(preRegistrationPrice, 'Pre-Registration Price', [])
</script>

<style>
.event-registration-form-fields {
  display: grid;
  grid-template-areas:
  'left right right';
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-registration-form-fields__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-registration-form-fields__right {
  grid-area: right;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-registration-form-fields__tip {
  color: var(--slate-400);
  font-size: 14px;
  margin-bottom: var(--space-2);
}

@media(max-width: 768px){
  .event-registration-form-fields {
    grid-template-areas:
    'left'
    'right';
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>