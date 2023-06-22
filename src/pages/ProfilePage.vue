<template>
  <ProfileViewer v-if="user" class="profile-page" :user="user" :best-placements="bestPlacements" />
</template>

<script lang="ts" setup>
  import { useRouteQueryParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ProfileViewer from '@/components/ProfileViewer.vue'
  import { useApi, useNavigation } from '@/compositions'

  const api = useApi()
  useNavigation({})

  const currentUserIdSubscription = useSubscription(api.users.getCurrentUser, [])
  const { response: currentUser } = await currentUserIdSubscription.promise()
  const userId = useRouteQueryParam('userId', currentUser!.userId)

  const userSubscription = useSubscription(api.users.getUser, [userId])
  const user = computed(() => userSubscription.response)

  const bestPlacementsSubscription = useSubscription(api.votingResults.getBestPlacementsCounts, [userId])
  const bestPlacements = computed(() => bestPlacementsSubscription.response ?? [])
</script>

<style>
.profile-page {
  padding: var(--space-md);
}
</style>