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
  import { useRouter } from 'vue-router'
  import PageHeader from '@/components/PageHeader.vue'
  import ProfileFormFields from '@/components/ProfileFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { IUser } from '@/models'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services/auth'

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const userSubscription = useSubscription(api.users.getUser, [currentUser.userId])
  userSubscription.promise().then(({ response }) => {
    if (response) {
      values.value = response
    }
  })

  const values = ref<IUser>()

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !values.value) {
      return
    }

    await api.users.updateUser(values.value)

    showToast('Saved!', 'success')
    router.push(routes.profile())
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
  padding: var(--space-4);
}
</style>