<template>
  <p-form class="profile-editor-page" @submit="submit">
    <PageHeader heading="General" />
    <ProfileFormFields v-if="values" v-model:values="values" />
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
  import ProfileFormFields from '@/components/ProfileFormFields.vue'
  import { useNavigation } from '@/compositions'
  import { UserAttributes } from '@/models/api'
  import { routes } from '@/router/routes'
  import { currentUser, auth } from '@/services/auth'
  import { mapper } from '@/services/mapper'

  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const values = ref<UserAttributes>(mapper.map('User', currentUser(), 'UserAttributes'))

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !values.value) {
      return
    }

    await auth.currentUser()?.update(values.value)

    showToast('Saved!', 'success')
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