<template>
  <div class="club-overview">
    {{ club?.name }}
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, watchEffect } from 'vue'
  import { useApi, useNavigationLeft, useNavigationTitle } from '@/compositions'
  import { routes } from '@/router/routes'

  const clubId = useRouteParam('clubId')
  const api = useApi()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  const club = computed(() => clubSubscription.response)

  useNavigationLeft({ name: 'Clubs', route: routes.clubs() })

  watchEffect(() => {
    if (club.value?.name) {
      useNavigationTitle(club.value.name)
    }
  })
</script>

<style>
.club-overview {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
}
</style>