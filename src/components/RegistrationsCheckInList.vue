<template>
  <div class="registrations-check-in-list">
    <template v-for="registration in registrations" :key="registration.registrationId">
      <RegistrationsCheckInListItem class="registration-list__registration" :registration="registration" @click="open" />
    </template>

    <CheckInModal v-model:showModal="showModal" />
  </div>
</template>

<script lang="ts" setup>
  import CheckInModal from '@/components/CheckInModal.vue'
  import RegistrationsCheckInListItem from '@/components/RegistrationsCheckInListItem.vue'
  import { useShowModal } from '@/compositions'
  import { Registration } from '@/models'

  defineProps<{
    eventId: string,
    registrations: Registration[],
  }>()

  const { showModal, open } = useShowModal()
</script>

<style>
.registrations-check-in-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>