<template>
  <div class="event-judging-form-fields">
    <div class="event-judging-form-fields__left">
      <p-label label="Voting Start" :message="votingStartError" :state="votingStartState">
        <template #description>
          Optional, if provided voting will automatically start at this time. Voting can always be manually started during the show.
        </template>
        <template #default="{ id }">
          <p-date-input :id="id" v-model="votingStart" :state="votingStartState" show-time clearable />
        </template>
      </p-label>

      <p-label label="Voting End" :message="votingEndError" :state="votingEndState">
        <template #description>
          Optional, if provided voting will automatically end at this time. Voting can always be manually ended during the show.
        </template>
        <template #default="{ id }">
          <p-date-input :id="id" v-model="votingEnd" :state="votingEndState" />
        </template>
      </p-label>

      <p-label label="Self Voting">
        <template #description>
          <template v-if="canVoteForSelf">
            Participants can for for their own entry in judging categories that allow for driver voting.
          </template>
          <template v-else>
            Participants can <strong>NOT</strong> for for their own entry.
          </template>
        </template>
        <template #default="{ id }">
          <p-toggle :id="id" v-model="canVoteForSelf" />
        </template>
      </p-label>

      <p-label label="Self Categorization">
        <template #description>
          <template v-if="driverSelfCategorization">
            Participants must assign their entry to the correct judging category.
          </template>
          <template v-else>
            Event host will assign entries to their correct judging category.
          </template>
        </template>
        <template #default="{ id }">
          <p-toggle :id="id" v-model="driverSelfCategorization" />
        </template>
      </p-label>

      <p-label label="Ballots per Registration" :message="ballotCountError" :state="ballotCountState">
        <template #description>
          Optional, number of ballots per registration.
        </template>
        <template #default="{ id }">
          <p-number-input :id="id" v-model="ballotCount" :state="ballotCountState" />
        </template>
      </p-label>
    </div>

    <div class="event-judging-form-fields__right">
      <JudgingCategoriesInput v-model:categories="judgingCategories" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import JudgingCategoriesInput from '@/components/JudgingCategoriesInput.vue'
  import { VotingCategory } from '@/models'
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

  const votingStart = usePatchRef(values, 'votingStart')
  const votingEnd = usePatchRef(values, 'votingEnd')
  const canVoteForSelf = usePatchRef(values, 'canVoteForSelf')
  const driverSelfCategorization = usePatchRef(values, 'driverSelfCategorization')
  const ballotCount = usePatchRef(values, 'ballotCount')

  const judgingCategories = ref<VotingCategory[]>([])

  const { error: votingStartError, state: votingStartState } = useValidation(votingStart, 'Voting Start', [])
  const { error: votingEndError, state: votingEndState } = useValidation(votingEnd, 'Voting End', [])
  const { error: ballotCountError, state: ballotCountState } = useValidation(ballotCount, 'Ballots per Registration', [])
</script>

<style>
.event-judging-form-fields {
  display: grid;
  grid-template-areas:
  'left right right';
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-judging-form-fields__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-judging-form-fields__right {
  grid-area: right;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

@media(max-width: 768px){
  .event-judging-form-fields {
    grid-template-areas:
    'left'
    'right';
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>