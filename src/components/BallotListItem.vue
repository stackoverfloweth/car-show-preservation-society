<template>
  <p-card class="ballot-list-item">
    <p-button inset icon="ShareIcon" />
    <p-link :to="routes.ballot(ballot.ballotId)">
      Open Ballot
    </p-link>
  </p-card>
</template>

<script lang="ts" setup>
  import { Ballot } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    ballot: Ballot,
  }>()
</script>