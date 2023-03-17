<template>
  <div class="club-page">
    <template v-if="club">
      <ClubOverview :club="club" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import ClubOverview from '@/components/ClubOverview.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const clubId = useRouteParam('clubId')
  const api = useApi()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  const club = computed(() => clubSubscription.response)

  useNavigation({
    left: route.name === 'clubs.view' ? { title: 'Clubs', route: routes.clubs() } : undefined,
  })
</script>