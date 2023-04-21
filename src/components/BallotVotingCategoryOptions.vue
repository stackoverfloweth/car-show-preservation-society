<template>
  <div class="ballot-voting-category-options">
    <template v-for="({ registration, vehicle, user }) in options" :key="registration.registrationId">
      <BallotVotingCategoryOption v-bind="{ registration, vehicle, user, event }" v-model:car-id="carId" :name="votingCategoryId" />
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

  const { votingCategoryId } = toRefs(props)
  const api = useApi()

  const optionsSubscription = useSubscription(api.ballotVoting.getBallotVotingCategoryData, [votingCategoryId], { lifecycle: 'app' })
  const options = computed(() => optionsSubscription.response ?? [])
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