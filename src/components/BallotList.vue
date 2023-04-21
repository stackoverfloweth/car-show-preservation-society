<template>
  <div class="ballot-list">
    <template v-for="(ballot, index) in ballots" :key="ballot.ballotId">
      <router-link :to="routes.ballot(ballot.ballotId)">
        <BallotListItem :index="index" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import BallotListItem from '@/components/BallotListItem.vue'
  import { Ballot } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    ballots: Ballot[],
  }>()
</script>

<style>
.ballot-list {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  overflow-x: auto;
}
</style>