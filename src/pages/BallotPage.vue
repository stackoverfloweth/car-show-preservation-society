<template>
  <div class="ballot-page">
    <div class="ballot-page__header">
      <div class="ballot-page__event">
        {{ club?.name }}
        <PageHeader :heading="event?.name" />
        Ballot <span class="ballot-page__ballot-name">{{ ballot?.name }}</span>
      </div>
      <img class="ballot-page__seal" :src="seal">
      <div class="ballot-page__actions">
        <template v-if="event?.isUpcoming">
          <p-button inset icon="ShareIcon" />
        </template>
        <template v-if="event?.votingOpen && ballot">
          <p-button inset icon="QrcodeIcon" />
        </template>
      </div>
    </div>

    <template v-if="event?.votingOpen && ballot">
      <div class="ballot-page__ballot">
        <template v-for="vote in ballot.votes" :key="vote.ballotVotingCategoryId">
          <BallotVotingCategoryComponent
            :car-id="votes[vote.ballotVotingCategoryId]"
            :event="event"
            :voting-category="vote.votingCategory"
            :open="isVotingCategoryOpen(vote.votingCategory)"
            @update:car-id="carId => setVote(vote, carId)"
            @update:open="toggleOpenVotingCategory(vote.votingCategory)"
          />
        </template>
      </div>
    </template>
    <template v-else-if="event?.isUpcoming">
      <p-empty-state class="ballot-page__voting-closed">
        <template #heading>
          Voting Not Open
        </template>
        <template #description>
          Voting for this event is scheduled to start at {{ format(event.votingStart ?? event.start, 'pp') }}
        </template>
      </p-empty-state>
    </template>
    <template v-else-if="event?.isPast">
      <p-empty-state class="ballot-page__voting-closed">
        <template #heading>
          Voting Has Concluded
        </template>
        <template #description>
          <p>Voting for this event ended at {{ format(event.votingEnd ?? event.end, 'pp') }}</p>
          <p-link :to="routes.event(eventId)">
            View Results
          </p-link>
        </template>
      </p-empty-state>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription, useSubscriptionWithDependencies, useValidationObserver } from '@prefecthq/vue-compositions'
  import { format } from 'date-fns'
  import { computed, ref, watch, watchEffect } from 'vue'
  import BallotVotingCategoryComponent from '@/components/BallotVotingCategory.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { useApi, useNavigation } from '@/compositions'
  import seal from '@/icons/csps-seal.svg'
  import { BallotVotingCategory, VotingCategory } from '@/models'
  import { VoteRequest } from '@/models/api'
  import { routes } from '@/router/routes'

  const eventId = useRouteParam('eventId')
  const ballotId = useRouteParam('ballotId')
  const { set } = useNavigation()

  const { validate, pending } = useValidationObserver()
  const api = useApi()

  const votes = ref<Record<string, string | null>>({})
  const openVotingCategoryId = ref<string>()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const ballotSubscription = useSubscription(api.ballots.getBallot, [ballotId])
  const ballot = computed(() => ballotSubscription.response)

  watch(ballot, ballot => {
    if (!ballot) {
      return
    }

    votes.value = ballot.votes.reduce<Record<string, string>>((summary, vote) => {
      if (vote.carId) {
        summary[vote.ballotVotingCategoryId] = vote.carId
      }

      return summary
    }, {})
  })

  const clubSubscriptionDependencies = computed<Parameters<typeof api.clubs.getClub> | null>(() => event.value ? [event.value.clubId] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClub, clubSubscriptionDependencies)
  const club = computed(() => clubSubscription.response)

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const request = Object.entries(votes.value).reduce<VoteRequest[]>((requests, [ballotVotingCategoryId, carId]) => {
      return [...requests, { ballotVotingCategoryId, carId }]
    }, [])
    await api.voting.setVotes(request)

    showToast('Ballot Saved!', 'success')
  }

  function isVotingCategoryOpen({ votingCategoryId }: VotingCategory): boolean {
    return openVotingCategoryId.value === votingCategoryId
  }

  function toggleOpenVotingCategory(votingCategory: VotingCategory): void {
    if (isVotingCategoryOpen(votingCategory)) {
      openVotingCategoryId.value = undefined
    } else {
      openVotingCategoryId.value = votingCategory.votingCategoryId
    }
  }

  function setVote(ballotVotingCategory: BallotVotingCategory, carId: string | null): void {
    votes.value[ballotVotingCategory.ballotVotingCategoryId] = carId

    toggleOpenVotingCategory(ballotVotingCategory.votingCategory)
  }

  watchEffect(() => {
    const left = { title: 'Event', route: routes.event(eventId.value) }
    const center = { title: 'Official Ballot' }
    const right = event.value?.votingOpen && ballot.value
      ? { title: 'Save', pending: pending.value, callback: submit }
      : undefined

    set({ left, center, right })
  })
</script>

<style>
.ballot-page {
  --seal-width: 100px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
}

.ballot-page__header {
  display: grid;
  grid-template-areas: 'header seal actions';
  grid-template-columns: minmax(0, 1fr) var(--seal-width) minmax(0, 1fr);
  gap: var(--space-2);
}

.ballot-page__seal {
  grid-area: header;
}

.ballot-page__seal {
  grid-area: seal;
  width: var(--seal-width);
}

.ballot-page__actions {
  grid-area: actions;
  display: flex;
  justify-content: end;
  align-items: start;
  gap: var(--space-3);
}

.ballot-page__ballot {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ballot-page__ballot-name {
  text-transform: uppercase;
}

@media(max-width: 768px){
  .ballot-page__header {
    grid-template-areas:
      'header seal'
      'actions actions';
    grid-template-columns: minmax(0, 1fr) var(--seal-width);
  }

  .ballot-page__actions {
    justify-content: start;
  }
}
</style>