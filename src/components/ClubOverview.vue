<template>
  <div class="club-overview">
    <SizedImage v-if="club.image" :image="club.image" class="club-overview__logo" />

    <p>{{ club.description }}</p>

    <ContactIdCard :user-id="club.contactUserId" show-label show-details />
  </div>
</template>

<script lang="ts" setup>
  import ContactIdCard from '@/components/ContactIdCard.vue'
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
  gap: var(--space-5);
}

.club-overview__logo {
  padding-top: 50%;
}
</style>