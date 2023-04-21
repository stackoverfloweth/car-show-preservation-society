<template>
  <div class="ballot-list">
    <template v-for="ballot in ballots" :key="ballot.ballotId">
      <router-link :to="routes.eventBallot(event.eventId, ballot.ballotId)">
        <BallotListItem :ballot="ballot" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import BallotListItem from '@/components/BallotListItem.vue'
  import { Ballot, Event } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    event: Event,
    ballots: Ballot[],
  }>()
</script>

<style>
.ballot-list {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
}
</style>