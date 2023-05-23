<template>
  <div class="auth-recovery-page">
    <p-card class="auth-recovery-page__form-container">
      <PageHeader heading="Recovery Account" />
      <p-form @submit="submit">
        <AuthSetPasswordFormFields v-model:values="values" />

        <div class="auth-recovery-page__actions">
          <p-button :to="routes.home()" inset>
            Cancel
          </p-button>
          <p-button type="submit" :loading="pending">
            Set Password
          </p-button>
        </div>
      </p-form>
    </p-card>
    <p-message v-if="!token || errored" error class="auth-recovery-page__body">
      <div class="auth-recovery-page__error">
        <p>Invalid Token</p>
        <p-button danger :to="routes.authLogin()">
          Return to Login
        </p-button>
      </div>
    </p-message>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AuthSetPasswordFormFields from '@/components/AuthSetPasswordFormFields.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { SetPasswordRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { auth } from '@/services/auth'

  const router = useRouter()
  const token = useRouteParam('token')
  const values = ref<Partial<SetPasswordRequest>>({})
  const errored = ref(false)

  const { validate, pending } = useValidationObserver()

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!token.value || !isValid) {
      try {
        await auth.recover(token.value)

        await auth.currentUser()?.update({ password: values.value.password })

        showToast('Password set!', 'success')
        router.push(routes.authLogin())
      } catch {
        errored.value = true
      }
    }
  }
</script>

<style>
.auth-recovery-page {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.auth-recovery-page__form-container {
  max-width: 640px;
  flex-grow: 1;
}

.auth-recovery-page__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width: 768px){
  .auth-recovery-page__actions {
    flex-direction: column;
  }
}
</style>