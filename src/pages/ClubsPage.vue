<template>
  <div class="clubs-page">
    <ClubsList :clubs="clubs" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ClubsList from '@/components/ClubsList.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const api = useApi()

  const clubsSubscription = useSubscription(api.clubs.getClubs)
  const clubs = computed(() => clubsSubscription.response ?? [])

  useNavigation({
    center: { title: 'Clubs' },
    right: { title: 'New', route: routes.clubCreate() },
  })
</script>

<style>
.clubs-page {
  padding: var(--space-4);
}
</style>