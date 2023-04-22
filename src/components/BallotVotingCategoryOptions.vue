<template>
  <div class="ballot-voting-category-options">
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
  height: 380px;
  display: grid;
  flex-direction: column;
  gap: var(--space-2);
  overflow-y: auto;
}
</style>