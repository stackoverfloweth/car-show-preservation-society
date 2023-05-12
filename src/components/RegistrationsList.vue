<template>
  <div class="registrations-list">
    <template v-for="registration in registrations" :key="registration.registrationId">
      <router-link :to="routes.eventRegistration(eventId, registration.registrationId)">
        <RegistrationsListItem class="registration-list__registration" :registration="registration" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import RegistrationsListItem from '@/components/RegistrationsListItem.vue'
  import { Registration } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    eventId: string,
    registrations: Registration[],
  }>()
</script>

<style>
.registrations-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>