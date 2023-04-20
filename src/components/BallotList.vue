<template>
  <div class="ballot-list">
    <template v-for="ballot in ballots" :key="ballot.ballotId">
      <BallotListItem :ballot="ballot" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import BallotListItem from '@/components/BallotListItem.vue'
  import { Ballot, Event } from '@/models'

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