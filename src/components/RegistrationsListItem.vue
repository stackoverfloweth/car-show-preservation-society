<template>
  <div class="registrations-list-item">
    <SizedImage :image="registration.vehicle.profileImage" class="registrations-list-item__image" rounded />
    <div class="registrations-list-item__body">
      <div class="registrations-list-item__user">
        {{ registration.user.displayName }}
      </div>
      <div class="registrations-list-item__vehicle">
        {{ registration.vehicle.year }} {{ registration.vehicle.make }} {{ registration.vehicle.model }}
      </div>
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
  display: flex;
  align-items: center;
  padding: var(--space-2);
  column-gap: var(--space-4);
  border-radius: var(--rounded);
}

.registrations-list-item__body {
  display: flex;
  flex-direction: column;
}

.registrations-list-item__image {
  grid-area: image;
  flex-shrink: 0;
  height: 50px;
  width: 50px;
}
</style>