<template>
  <div class="signup-page">
    <p-card class="signup-page__form-container">
      <PageHeader heading="Sign Up">
        <template #actions>
          <p-link :to="routes.authLogin()">
            Login
          </p-link>
        </template>
      </PageHeader>
      <p-form class="signup-page__form" @submit="signup">
        <AuthSignupFormFields v-model:values="values" />

        <div class="signup-page__actions">
          <p-button :to="routes.home()" inset>
            Cancel
          </p-button>
          <p-button type="submit" :loading="pending">
            Signup
          </p-button>
        </div>
      </p-form>
    </p-card>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useLocalStorage, useValidationObserver } from '@prefecthq/vue-compositions'
  import { User } from 'gotrue-js'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AuthSignupFormFields from '@/components/AuthSignupFormFields.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { SignupRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { auth, handleAuthError } from '@/services/auth'

  const router = useRouter()
  const values = ref<Partial<SignupRequest>>({})

  const { validate, pending } = useValidationObserver()

  async function signup(): Promise<User | undefined> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const { emailAddress, password } = values.value as SignupRequest

    try {
      const token = await auth.signup(emailAddress, password)
      const { value, remove } = useLocalStorage('auth-redirect', routes.home())
      router.push(value.value)
      remove()
      showToast('Success! Please confirm your email address', 'success')
    } catch (exception) {
      handleAuthError(exception)
    }
  }
</script>

<style>
.signup-page {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.signup-page__form-container {
  max-width: 640px;
  flex-grow: 1;
}

.signup-page__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width: 768px){
  .signup-page__actions {
    flex-direction: column;
  }
}
</style>