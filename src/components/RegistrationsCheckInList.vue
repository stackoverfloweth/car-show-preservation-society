<template>
  <div class="registrations-check-in-list">
    <template v-for="registration in registrations" :key="registration.registrationId">
      <RegistrationsCheckInListItem class="registration-list__registration" :registration="registration" @click="openCheckInModal(registration)" />
    </template>

    <template v-if="selectedRegistration">
      <CheckInModal
        v-model:showModal="showModal"
        :event="event"
        :registration="selectedRegistration"
        @mark-paid="markAsPaid"
        @mark-unpaid="markAsUnpaid"
        @complete="completeCheckIn"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { computed, ref } from 'vue'
  import CheckInModal from '@/components/CheckInModal.vue'
  import RegistrationsCheckInListItem from '@/components/RegistrationsCheckInListItem.vue'
  import { useApi } from '@/compositions'
  import { Event, Registration } from '@/models'

  defineProps<{
    event: Event,
    registrations: Registration[],
  }>()

  const emit = defineEmits<{
    (event: 'changed'): void,
  }>()

  const api = useApi()

  const selectedRegistration = ref<Registration>()
  const showModal = computed({
    get() {
      return !!selectedRegistration.value
    },
    set(value) {
      if (!value) {
        selectedRegistration.value = undefined
      }
    },
  })

  function openCheckInModal(registration: Registration): void {
    selectedRegistration.value = registration
  }

  function closeCheckInModal(): void {
    showModal.value = false
  }

  async function markAsPaid(): Promise<void> {
    if (!selectedRegistration.value) {
      return
    }

    await api.registration.markAsPaid(selectedRegistration.value.registrationId)

    showToast('Marked as Paid!', 'success')
    emit('changed')
  }

  async function markAsUnpaid(): Promise<void> {
    if (!selectedRegistration.value) {
      return
    }

    await api.registration.markAsUnpaid(selectedRegistration.value.registrationId)

    showToast('Marked as UnPaid!', 'success')
    emit('changed')
  }

  async function completeCheckIn(): Promise<void> {
    if (!selectedRegistration.value) {
      return
    }

    await api.registration.checkIn(selectedRegistration.value.registrationId)

    showToast('Checked In!', 'success')
    closeCheckInModal()
    emit('changed')
  }
</script>

<style>
.registrations-check-in-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>