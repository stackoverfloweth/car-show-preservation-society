<template>
  <p-form class="profile-editor-page" @submit="submit">
    <PageHeader heading="General" />
    <ProfileFormFields v-if="values" v-model:values="values" />
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
  import ProfileFormFields from '@/components/ProfileFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { UserRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { mapper } from '@/services'

  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const userSubscription = useSubscription(api.users.getCurrentUser, [])
  const values = ref<UserRequest>()

  watchEffect(() => {
    values.value = mapper.map('User', userSubscription.response, 'UserRequest')
  })

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !values.value) {
      return
    }

    await api.users.updateUser(values.value)
    showToast('Saved!', 'success')
    userSubscription.refresh()
  }

  watchEffect(() => {
    set({
      left: { title: 'Profile', route: routes.profile() },
      right: { title: 'Save', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.profile-editor-page {
  padding: var(--space-md);
}
</style>