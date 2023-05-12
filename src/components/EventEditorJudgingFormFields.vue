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

      <p-label label="Must Be Present to Win">
        <template #description>
          <template v-if="mustBePresentToWin">
            Participants are required to be present at award ceremony to be considered for judging.
          </template>
          <template v-else>
            Participants are <strong>NOT</strong> required to be preset to be considered for judging.
          </template>
        </template>
        <template #default="{ id }">
          <p-toggle :id="id" v-model="mustBePresentToWin" />
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

      <p-label label="Max Judging Categories">
        <template #description>
          <template v-if="maxSelfCategorization">
            How many categories are participants allowed to enter? Default value is 1 category.
            <p>(only applies if self categorization is enabled)</p>
          </template>
          <template v-else>
            Event host will assign entries to their correct judging category.
          </template>
        </template>
        <template #default="{ id }">
          <p-number-input :id="id" v-model="maxSelfCategorization" :disabled="!driverSelfCategorization" placeholder="1" />
        </template>
      </p-label>

      <p-label label="Ballots per Registration" :message="ballotCountError" :state="ballotCountState">
        <template #description>
          Optional, number of ballots per registration. Default is 1 ballot.
        </template>
        <template #default="{ id }">
          <p-number-input :id="id" v-model="ballotCount" :state="ballotCountState" placeholder="1" />
        </template>
      </p-label>
    </div>

    <div class="event-editor-judging-form-fields__right">
      <JudgingCategoriesInputForm v-if="event.eventId" :event-id="event.eventId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import JudgingCategoriesInputForm from '@/components/JudgingCategoriesInputForm.vue'
  import { EventRequest } from '@/models/api'
  import { mapper } from '@/services'

  const props = defineProps<{
    event: EventRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:event', value: EventRequest): void,
  }>()

  const event = computed({
    get() {
      return { ...props.event }
    },
    set(value) {
      emit('update:event', value)
    },
  })

  const votingStart = computed<Date | undefined>({
    get() {
      return mapper.map('String', event.value.votingStart, 'Date')
    },
    set(value) {
      event.value.votingStart = mapper.map('Date', value, 'String')
    },
  })

  const votingEnd = computed<Date | undefined>({
    get() {
      return mapper.map('String', event.value.votingEnd, 'Date')
    },
    set(value) {
      event.value.votingEnd = mapper.map('Date', value, 'String')
    },
  })

  const mustBePresentToWin = usePatchRef(event, 'mustBePresentToWin')
  const canVoteForSelf = usePatchRef(event, 'canVoteForSelf')
  const driverSelfCategorization = usePatchRef(event, 'driverSelfCategorization')
  const maxSelfCategorization = usePatchRef(event, 'maxSelfCategorization')
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
  column-gap: var(--space-lg);
  row-gap: var(--space-md);
}

.event-editor-judging-form-fields__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-lg);
  row-gap: var(--space-md);
}

.event-editor-judging-form-fields__right {
  grid-area: right;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-lg);
  row-gap: var(--space-md);
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