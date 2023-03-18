<template>
  <div class="club-overview">
    <SizedImage v-if="club.clubLogo" :image="club.clubLogo" class="club-overview__logo" />

    <span>{{ club.description }}</span>

    <ContactCard :user-id="club.contactUserId" />
  </div>
</template>

<script lang="ts" setup>
  import ContactCard from '@/components/ContactCard.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { Club } from '@/models'

  defineProps<{
    club: Club,
  }>()
</script>

<style>
.club-overview {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.club-overview__logo {
  height: 140px;
}
</style>