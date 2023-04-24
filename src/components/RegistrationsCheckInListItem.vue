<template>
  <div class="registrations-check-in-list-item" role="button">
    <SizedImage :image="registration.vehicle.profileImage" class="registrations-check-in-list-item__image" rounded />
    <div class="registrations-check-in-list-item__body">
      <div class="registrations-check-in-list-item__user">
        {{ registration.user.displayName }}
      </div>
      <div class="registrations-check-in-list-item__vehicle">
        {{ registration.vehicle.year }} {{ registration.vehicle.make }} {{ registration.vehicle.model }}
      </div>
      <div class="registrations-check-in-list-item__tags">
        <p-tag class="registrations-check-in-list-item__tag" :class="{ 'registrations-check-in-list-item__tag--active': registration.stripePaymentId }" icon="CurrencyDollarIcon" />
        <p-tag class="registrations-check-in-list-item__tag" :class="{ 'registrations-check-in-list-item__tag--active': registration.isCheckedIn }" icon="ClipboardCheckIcon" />
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
.registrations-check-in-list-item {
  display: flex;
  align-items: center;
  column-gap: var(--space-4);
  padding: var(--space-2);
  border-radius: var(--rounded);
}

.registrations-check-in-list-item:hover {
  cursor: pointer;
  background-color: var(--slate-700);
}

.registrations-check-in-list-item__image {
  border: 1px solid var(--slate-500);
  flex-shrink: 0;
  height: 50px;
  width: 50px;
}

.registrations-check-in-list-item__body {
  display: flex;
  flex-direction: column;
}

.registrations-check-in-list-item__tags {
  display: flex;
  gap: var(--space-2);
}

.registrations-check-in-list-item__tag {
  white-space: nowrap;
  padding: var(--space-2);
  border: 1px solid var(--slate-500);
}

.registrations-check-in-list-item__tag--active {
  background-color: var(--green-800) !important;
}
</style>