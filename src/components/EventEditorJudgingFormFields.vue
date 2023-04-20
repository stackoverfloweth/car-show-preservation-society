<template>
  <div class="event-editor-judging-form-fields">
    <div class="event-editor-judging-form-fields__left">
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

    <div class="event-editor-judging-form-fields__right">
      <JudgingCategoriesInput :event-id="event.eventId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import JudgingCategoriesInput from '@/components/JudgingCategoriesInput.vue'
  import { Event } from '@/models'

  const props = defineProps<{
    event: Event,
  }>()

  const emit = defineEmits<{
    (event: 'update:event', value: Event): void,
  }>()

  const event = computed({
    get() {
      return props.event
    },
    set(value) {
      emit('update:event', value)
    },
  })

  const votingStart = usePatchRef(event, 'votingStart')
  const votingEnd = usePatchRef(event, 'votingEnd')
  const canVoteForSelf = usePatchRef(event, 'canVoteForSelf')
  const driverSelfCategorization = usePatchRef(event, 'driverSelfCategorization')
  const ballotCount = usePatchRef(event, 'ballotCount')

  const { error: votingStartError, state: votingStartState } = useValidation(votingStart, 'Voting Start', [])
  const { error: votingEndError, state: votingEndState } = useValidation(votingEnd, 'Voting End', [])
  const { error: ballotCountError, state: ballotCountState } = useValidation(ballotCount, 'Ballots per Registration', [])
</script>

<style>
.event-editor-judging-form-fields {
  display: grid;
  grid-template-areas:
  'left right right';
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-editor-judging-form-fields__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-editor-judging-form-fields__right {
  grid-area: right;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

@media(max-width: 768px){
  .event-editor-judging-form-fields {
    grid-template-areas:
    'left'
    'right';
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>