<template>
  <div class="club-card">
    <template v-if="club">
      <SizedImage v-if="club.clubLogo" :image="club.clubLogo" class="club-card__logo" />
      <p-bread-crumbs :crumbs="[{ text: club.name }]" />
      <span>{{ club.description }}</span>
      <ContactCard :user-id="club.contactUserId" show-label show-details />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import ContactCard from '@/components/ContactCard.vue'
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
  flex-direction: column;
  gap: var(--space-4);
}

.club-card__logo {
  padding-top: 50%;
}

.club-card__name {
  font-size: 1.25rem;
}
</style>