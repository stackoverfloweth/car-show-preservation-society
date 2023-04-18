<template>
  <ProfileViewer v-if="user" class="profile-page" :user="user" />
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ProfileViewer from '@/components/ProfileViewer.vue'
  import { useApi, useNavigation } from '@/compositions'

  const userId = 'ABC123' // todo: from auth
  const api = useApi()
  useNavigation({})

  const userSubscription = useSubscription(api.users.getUser, [userId])
  const user = computed(() => userSubscription.response)
</script>

<style>
.profile-page {
  padding: var(--space-4);
}
</style>