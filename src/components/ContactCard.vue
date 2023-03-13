<template>
  <div class="contact-card">
    <template v-if="user">
      <p-bread-crumbs :crumbs="[{ text: 'Contact' }]" />
      <div class="contact-card__name">
        {{ user.firstName }}  {{ user.lastName }}
      </div>
      <div class="contact-card__email">
        <p-link v-if="user.emailAddress" :href="`mailto:${user.emailAddress}`">
          {{ user.emailAddress }}
        </p-link>
      </div>
      <div class="contact-card__phone">
        <p-link v-if="user.phoneNumber" :href="`tel:${user.phoneNumber}`">
          {{ formatPhoneNumber(user.phoneNumber) }}
        </p-link>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import { useApi } from '@/compositions'
  import { formatPhoneNumber } from '@/utilities'

  const props = defineProps<{
    userId: string | undefined,
  }>()

  const { userId } = toRefs(props)
  const api = useApi()

  const userSubscriptionArgs = computed<Parameters<typeof api.users.getUser> | null>(() => userId.value ? [userId.value] : null)
  const userSubscription = useSubscriptionWithDependencies(api.users.getUser, userSubscriptionArgs)
  const user = computed(() => userSubscription.response)
</script>