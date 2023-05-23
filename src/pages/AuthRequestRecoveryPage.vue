<template>
  <div class="auth-request-recovery-page">
    <p-card class="auth-request-recovery-page__form-container">
      <PageHeader heading="Request Recovery Email" />
      <p-form class="auth-request-recovery-page__form" @submit="login">
        <AuthRequestRecoveryFormFields v-model:values="values" />

        <div class="auth-request-recovery-page__actions">
          <p-button :to="routes.authLogin()" inset>
            Cancel
          </p-button>
          <p-button type="submit" :loading="pending">
            Submit
          </p-button>
        </div>
      </p-form>
    </p-card>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { User } from 'gotrue-js'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AuthRequestRecoveryFormFields from '@/components/AuthRequestRecoveryFormFields.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { RecoveryRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { auth, handleAuthError } from '@/services/auth'

  const router = useRouter()
  const values = ref<Partial<RecoveryRequest>>({})

  const { validate, pending } = useValidationObserver()

  async function login(): Promise<User | undefined> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const { emailAddress } = values.value as RecoveryRequest

    try {
      await auth.requestPasswordRecovery(emailAddress)
      showToast('Recovery email sent!', 'success')
      router.push(routes.authLogin())
    } catch (exception) {
      handleAuthError(exception, emailAddress)
    }
  }
</script>

<style>
.auth-request-recovery-page {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.auth-request-recovery-page__form-container {
  max-width: 640px;
  flex-grow: 1;
}

.auth-request-recovery-page__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width: 768px){
  .auth-request-recovery-page__actions {
    flex-direction: column;
  }
}
</style>