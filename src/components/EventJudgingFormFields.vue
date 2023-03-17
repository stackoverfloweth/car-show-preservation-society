<template>
  <div class="event-judging-form-fields">
    <div class="event-judging-form-fields__top">
      <div class="event-judging-form-fields__tip">
        Will the event having judging? Can be staff and/or participant voting. Learn more about <p-link>Event Voting</p-link>
      </div>
      <p-toggle v-model="hasVoting" />
    </div>

    <template v-if="hasVoting">
      <div class="event-judging-form-fields__left">
        <p-label label="Voting Start" :message="votingStartError" :state="votingStartState">
          <template #default="{ id }">
            <div class="event-judging-form-fields__tip">
              Optional, if provided voting will automatically start at this time. Voting can always be manually started during the show.
            </div>
            <p-date-input :id="id" v-model="votingStart" :state="votingStartState" show-time clearable />
          </template>
        </p-label>

        <p-label label="Voting End" :message="votingEndError" :state="votingEndState">
          <template #default="{ id }">
            <div class="event-judging-form-fields__tip">
              Optional, if provided voting will automatically end at this time. Voting can always be manually ended during the show.
            </div>
            <p-date-input :id="id" v-model="votingEnd" :state="votingEndState" />
          </template>
        </p-label>

        <p-label label="Self Voting">
          <template #default="{ id }">
            <div class="event-judging-form-fields__tip">
              Participants can <strong v-if="!canVoteForSelf">NOT</strong> for for their own entry.
            </div>
            <p-toggle :id="id" v-model="canVoteForSelf" />
          </template>
        </p-label>

        <p-label label="Self Categorization">
          <template #default="{ id }">
            <div v-if="driverSelfCategorization" class="event-judging-form-fields__tip">
              Participants must assign their entry to the correct judging category.
            </div>
            <div v-else class="event-judging-form-fields__tip">
              Event host will assign entries to their correct judging category.
            </div>
            <p-toggle :id="id" v-model="driverSelfCategorization" />
          </template>
        </p-label>

        <p-label label="Ballots per Registration" :message="ballotCountError" :state="ballotCountState">
          <template #default="{ id }">
            <div class="event-judging-form-fields__tip">
              Optional, number of ballots per registration.
            </div>
            <p-number-input :id="id" v-model="ballotCount" :state="ballotCountState" />
          </template>
        </p-label>
      </div>

      <div class="event-judging-form-fields__right">
        <p-label label="Judging Categories" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
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

  const hasVoting = usePatchRef(values, 'hasVoting')
  const votingStart = usePatchRef(values, 'votingStart')
  const votingEnd = usePatchRef(values, 'votingEnd')
  const canVoteForSelf = usePatchRef(values, 'canVoteForSelf')
  const driverSelfCategorization = usePatchRef(values, 'driverSelfCategorization')
  const ballotCount = usePatchRef(values, 'ballotCount')

  const { error: votingStartError, state: votingStartState } = useValidation(votingStart, 'VotingStart', [])
  const { error: votingEndError, state: votingEndState } = useValidation(votingEnd, 'VotingEnd', [])
  const { error: ballotCountError, state: ballotCountState } = useValidation(ballotCount, 'BallotCount', [])
</script>

<style>
.event-judging-form-fields {
  display: grid;
  grid-template-areas:
  'top top top'
  'left right right';
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.event-judging-form-fields__top {
  grid-area: top;
}

.event-judging-form-fields__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: var(--space-4);
}

.event-judging-form-fields__right {
  grid-area: right;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: var(--space-4);
}

.event-judging-form-fields__tip {
  color: var(--slate-400);
  font-size: 14px;
  margin-bottom: var(--space-2);
}

@media(max-width: 768px){
  .event-judging-form-fields {
    grid-template-areas:
    'top'
    'left'
    'right';
    grid-template-columns: 1fr;
  }
}
</style>