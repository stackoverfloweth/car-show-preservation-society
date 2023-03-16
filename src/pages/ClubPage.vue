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
  import ClubOverview from '@/components/ClubOverview.vue'
  import { useApi } from '@/compositions'

  const clubId = useRouteParam('clubId')
  const api = useApi()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  const club = computed(() => clubSubscription.response)
</script>