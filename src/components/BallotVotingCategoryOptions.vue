<template>
  <div class="ballot-voting-category-options">
    <template v-if="registrations.length === 0 && registrationsSubscription.executed">
      <p-message error class="ballot-voting-category-options__empty">
        Nobody is registered for this category
      </p-message>
    </template>
    <template v-for="registration in registrations" :key="registration.registrationId">
      <BallotVotingCategoryOption v-bind="{ registration, event }" v-model:car-id="carId" :name="votingCategoryId" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import BallotVotingCategoryOption from '@/components/BallotVotingCategoryOption.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'

  const props = defineProps<{
    votingCategoryId: string,
    event: Event,
    carId: string | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:carId', value: string | null): void,
  }>()

  const carId = computed({
    get() {
      return props.carId ?? null
    },
    set(value) {
      emit('update:carId', value)
    },
  })

  const eventId = computed(() => props.event.eventId)
  const { votingCategoryId } = toRefs(props)
  const api = useApi()

  const registrationsSubscription = useSubscription(api.registration.getRegistrationsForCategory, [eventId, votingCategoryId], { lifecycle: 'app' })
  const registrations = computed(() => registrationsSubscription.response ?? [])
</script>

<style>
.ballot-voting-category-options {
  max-height: 380px;
  display: grid;
  flex-direction: column;
  gap: var(--space-xxs);
  overflow-y: auto;
}

.ballot-voting-category-options__empty {
  margin-bottom: var(--space-md);
}
</style>