<template>
  <div class="event-ballots">
    <BallotList :event="event" :ballots="ballots" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import BallotList from '@/components/BallotList.vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    event: Event,
  }>()

  const api = useApi()
  const eventId = computed(() => props.event.eventId)

  const ballotSubscription = useSubscription(api.ballots.findBallots, [eventId, currentUser.userId])
  const ballots = computed(() => ballotSubscription.response ?? [])
</script>