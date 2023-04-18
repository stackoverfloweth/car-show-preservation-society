<template>
  <p-form class="club-application-form" @submit="joinPrivateClub">
    <p-label label="Are you sure?">
      <template #description>
        Your application including public profile information, your email address, and optional message below will be sent to the Club admins for review.
      </template>
      <template #default="{ id }">
        <p-toggle :id="id" v-model="agreed" />
      </template>
    </p-label>

    <p-label label="Message to Admin (optional)">
      <template #default="{ id }">
        <p-textarea :id="id" v-model="clubApplicationMessage" rows="5" />
      </template>
    </p-label>

    <div class="club-application-form__actions">
      <p-button inset @click="emit('close')">
        Cancel
      </p-button>
      <p-button type="submit" :disabled="!agreed">
        Send
      </p-button>
    </div>
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { useApi } from '@/compositions'
  import { Club } from '@/models'
  import { userId } from '@/services/auth'

  const props = defineProps<{
    club: Club,
  }>()

  const emit = defineEmits<{
    (event: 'close'): void,
  }>()

  const api = useApi()

  const applied = ref(false)
  const agreed = ref(false)
  const clubApplicationMessage = ref<string>()

  const userIsMemberSubscription = useSubscription(api.users.isMemberOfClub, [userId, props.club.clubId])
  const currentUserIsMember = computed(() => userIsMemberSubscription.response ?? false)

  async function joinPrivateClub(): Promise<void> {
    if (!agreed.value) {
      return
    }

    if (!currentUserIsMember.value) {
      await api.clubs.joinClub(props.club.clubId, userId, clubApplicationMessage.value)

      applied.value = true

      showToast('Application Sent!', 'success')
      emit('close')
    }
  }
</script>

<style>
.club-application-form__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .club-application-form__actions {
    flex-direction: column;
  }
}
</style>