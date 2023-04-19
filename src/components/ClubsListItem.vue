<template>
  <p-card class="clubs-list-item">
    <template v-if="club.clubLogo">
      <SizedImage class="clubs-list-item__logo" :image="club.clubLogo" />
    </template>
    <div class="clubs-list-item__name">
      {{ club.name }}
    </div>
  </p-card>
</template>

<script lang="ts" setup>
  import SizedImage from '@/components/SizedImage.vue'
  import { Club } from '@/models/club'

  defineProps<{
    club: Club,
  }>()
</script>

<style>
.clubs-list-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
}

.clubs-list-item__logo {
  padding-top: 50%;
  width: 100%;
}

.clubs-list-item__name {
  text-align: center;
}
</style>