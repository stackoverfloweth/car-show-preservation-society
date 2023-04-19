<template>
  <p-form class="club-member-invite-form" @submit="submit">
    <p-label label="Email Address">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="emailAddress" />
      </template>
    </p-label>

    <div class="club-application-form__actions">
      <p-button inset @click="close">
        Cancel
      </p-button>
      <p-button type="submit" :loading="pending">
        Send
      </p-button>
    </div>
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, toRefs } from 'vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    clubId: string,
  }>()

  const emit = defineEmits<{
    (event: 'close'): void,
  }>()

  const api = useApi()
  const { clubId } = toRefs(props)
  const { validate, pending } = useValidationObserver()

  const emailAddress = ref<string>()

  function close(): void {
    emit('close')
  }

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !emailAddress.value) {
      return
    }

    await api.clubInvitations.inviteClubMember(clubId.value, emailAddress.value)

    showToast('Invitation Sent!', 'success')
    close()
  }
</script>