<template>
  <div class="registrations-list-item">
    <SizedImage :image="registration.vehicle.profileImage" class="registration-list-item__image" rounded />
    <div class="registration-list-item__user">
      {{ registration.user.displayName }}
    </div>
    <div class="registration-list-item__vehicle">
      {{ registration.vehicle.year }} {{ registration.vehicle.make }} {{ registration.vehicle.model }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SizedImage from '@/components/SizedImage.vue'
  import { Registration } from '@/models'

  defineProps<{
    registration: Registration,
  }>()
</script>

<style>
.registrations-list-item {
  display: grid;
  column-gap: var(--space-4);
  padding: var(--space-2);
  border-radius: var(--rounded);
  grid-template-areas:
    'image user'
    'image vehicle';
  grid-template-columns: min-content 1fr;
}

.registration-list-item__image {
  grid-area: image;
  flex-shrink: 0;
  height: 50px;
  width: 50px;
}

.registration-list-item__vehicle {
  grid-area: 'vehicle'
}

.registration-list-item__user {
  grid-area: 'user'
}
</style>