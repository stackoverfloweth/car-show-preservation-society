<template>
  <div class="club-card">
    <template v-if="club">
      <SizedImage v-if="club.image" :image="club.image" class="club-card__logo" />
      <PageHeader :heading="club.name" />
      <p>{{ club.description }}</p>
      <ContactIdCard :user-id="club.contactUserId" show-label show-details />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import ContactIdCard from '@/components/ContactIdCard.vue'
  import PageHeader from '@/components/PageHeader.vue'
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
  gap: var(--space-md);
}

.club-card__logo {
  padding-top: 50%;
}

.club-card__name {
  font-size: var(--text-md);
}
</style>