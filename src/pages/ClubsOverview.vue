<template>
  <div class="clubs-overview">
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

  useNavigation(undefined, 'Clubs', { name: 'New', route: routes.clubsCreate() })
</script>

<style>
.clubs-overview {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
}

.clubs-overview__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>