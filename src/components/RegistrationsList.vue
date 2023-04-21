<template>
  <div class="registrations-list">
    <template v-for="registration in registrations" :key="registration.registrationId">
      <RegistrationListItem :registration="registration" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import RegistrationListItem from '@/components/RegistrationsListItem.vue'
  import { Registration } from '@/models'

  defineProps<{
    registrations: Registration[],
  }>()
</script>

<style>

</style>