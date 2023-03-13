<template>
  <div class="club-card">
    <template v-if="club">
      <SizedImage v-if="club?.clubLogo" class="club-card__logo" :src="club?.clubLogo" />
      <div class="club-card__name">
        {{ club.name }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    clubId: string,
  }>()

  const { clubId } = toRefs(props)
  const api = useApi()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  const club = computed(() => clubSubscription.response)
</script>

<style>
.club-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.club-card__logo {
  max-width: 40px;
  flex-grow: 1;
}
</style>