<template>
  <!-- <ContactCard v-if="user" :user="user" /> -->
</template>

<script lang="ts" setup>
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import ContactCard from '@/components/ContactCard.vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    userId: string | undefined,
  }>()

  const { userId } = toRefs(props)
  const api = useApi()

  // todo: rework now that user comes from netlify
  // const userSubscriptionArgs = computed<Parameters<typeof api.users.getUser> | null>(() => userId.value ? [userId.value] : null)
  // const userSubscription = useSubscriptionWithDependencies(api.users.getUser, userSubscriptionArgs)
  // const user = computed(() => userSubscription.response)
</script>