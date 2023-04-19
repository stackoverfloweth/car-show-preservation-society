<template>
  <div class="clubs-page">
    <ClubsFilterComponent v-model:filter="filter" v-model:sort="sort" />
    <ClubsList :clubs="clubs" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import ClubsFilterComponent from '@/components/ClubsFilter.vue'
  import ClubsList from '@/components/ClubsList.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { ClubsFilter } from '@/models/api/clubsFilter'
  import { ClubsSort } from '@/models/api/clubsSort'
  import { routes } from '@/router/routes'

  const api = useApi()

  const filter = ref<ClubsFilter>({})
  const sort = ref<ClubsSort>({})

  const clubsSubscription = useSubscription(api.clubs.getClubs, [filter, sort])
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