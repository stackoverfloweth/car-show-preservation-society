<template>
  <div class="ballot-voting-category-options">
    <template v-for="({ registration, vehicle, user }) in options" :key="registration.registrationId">
      <p-radio
        v-model="carId"
        class="ballot-voting-category-options__option"
        :class="classes.option(registration)"
        label=""
        :value="registration.carId!"
        :name="votingCategoryId"
      >
        <template #label>
          <BallotVotingCategoryOption v-bind="{ registration, vehicle, user }" :selected="carId === registration.carId" />
        </template>
      </p-radio>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import BallotVotingCategoryOption from '@/components/BallotVotingCategoryOption.vue'
  import { useApi } from '@/compositions'
  import { Registration } from '@/models'

  const props = defineProps<{
    votingCategoryId: string,
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

  const classes = computed(() => ({
    option: (registration: Registration) => ({
      'ballot-voting-category-options__option--selected': carId.value === registration.carId,
    }),
  }))
</script>

<style>
.ballot-voting-category-options {
  height: 380px;
  display: grid;
  flex-direction: column;
  gap: var(--space-2);
  overflow-y: auto;
}

.ballot-voting-category-options__option {
  padding: var(--space-2);
}

.ballot-voting-category-options__option:nth-child(even):not(.ballot-voting-category-options__option--selected) {
  background-color: var(--slate-700);
}

.ballot-voting-category-options__option--selected {
  background-color: var(--green-700);
}

.ballot-voting-category-options__option .p-label__header,
.ballot-voting-category-options__option .p-label__label {
  width: 100% !important;
}
</style>