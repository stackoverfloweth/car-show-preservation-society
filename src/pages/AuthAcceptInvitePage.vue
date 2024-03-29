<template>
  <div class="auth-accept-invite-page">
    <p-card class="auth-accept-invite-page__form-container">
      <PageHeader heading="Accept Invitation" />
      <p-form class="auth-accept-invite-page__form" @submit="accept">
        <AuthSetPasswordFormFields v-model:values="values" />

        <div class="auth-accept-invite-page__actions">
          <p-button :to="routes.home()" inset>
            Cancel
          </p-button>
          <p-button type="submit" :loading="pending">
            Accept-invite
          </p-button>
        </div>
      </p-form>
    </p-card>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useValidationObserver } from '@prefecthq/vue-compositions'
  import { User } from 'gotrue-js'
  import { ref } from 'vue'
  import AuthSetPasswordFormFields from '@/components/AuthSetPasswordFormFields.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { SetPasswordRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { auth, handleAuthError } from '@/services/auth'

  const token = useRouteParam('token')
  const values = ref<Partial<SetPasswordRequest>>({})

  const { validate, pending } = useValidationObserver()

  async function accept(): Promise<User | undefined> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const { password, remember } = values.value as SetPasswordRequest

    try {
      const user = await auth.acceptInvite(token.value, password, remember)
      console.log({ user })
      showToast('Account created!', 'success')
    } catch (exception) {
      handleAuthError(exception)
    }
  }
</script>

<style>
.auth-accept-invite-page {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.auth-accept-invite-page__form-container {
  max-width: 640px;
  flex-grow: 1;
}

.auth-accept-invite-page__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width: 768px){
  .auth-accept-invite-page__actions {
    flex-direction: column;
  }
}
</style>