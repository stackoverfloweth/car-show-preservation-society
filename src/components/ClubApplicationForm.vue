<template>
  <p-form class="club-application-form" @submit="joinPrivateClub">
    <p-label label="Are you sure?">
      <template #description>
        Your application including public profile information, your email address, and optional message below will be sent to the Club admins for review.
      </template>
    </p-label>

    <p-label label="Message to Admin (optional)">
      <template #default="{ id }">
        <p-textarea :id="id" v-model="clubApplicationMessage" rows="5" />
      </template>
    </p-label>

    <div class="club-application-form__actions">
      <p-button inset @click="close">
        Cancel
      </p-button>
      <p-button type="submit">
        I'm sure, send it!
      </p-button>
    </div>
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { ref } from 'vue'
  import { useApi } from '@/compositions'
  import { Club } from '@/models'
  import { currentIdentity } from '@/services/auth'

  const props = defineProps<{
    club: Club,
  }>()

  const emit = defineEmits<{
    (event: 'close' | 'submit'): void,
  }>()

  const api = useApi()

  const applied = ref(false)
  const clubApplicationMessage = ref<string>()

  function close(): void {
    emit('close')
  }

  async function joinPrivateClub(): Promise<void> {
    await api.clubInvitations.applyToClub(props.club.clubId, currentIdentity(), clubApplicationMessage.value)

    applied.value = true

    showToast('Application Sent!', 'success')
    close()
  }
</script>

<style>
.club-application-form__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width: 768px){
  .club-application-form__actions {
    flex-direction: column;
  }
}
</style>