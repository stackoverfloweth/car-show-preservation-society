<template>
  <div class="login-page">
    <PageHeader heading="Login" />
    <p-form class="login-page__form" @submit="login">
      <AuthLoginFormFields v-model:values="values" />

      <p-link :to="routes.signup()">
        Sign Up
      </p-link>

      <div class="login-page__actions">
        <p-button :to="routes.home()" inset>
          Cancel
        </p-button>
        <p-button type="submit" :loading="pending">
          Login
        </p-button>
      </div>
    </p-form>
  </div>
</template>

<script lang="ts" setup>
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { User } from 'gotrue-js'
  import { ref } from 'vue'
  import AuthLoginFormFields from '@/components/AuthLoginFormFields.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { LoginRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { auth, handleAuthError } from '@/services'

  const values = ref<Partial<LoginRequest>>({})

  const { validate, pending } = useValidationObserver()

  async function login(): Promise<User | undefined> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const { emailAddress, password, remember = false } = values.value as LoginRequest

    try {
      return auth.login(emailAddress, password, remember)
    } catch (exception) {
      handleAuthError(exception, emailAddress)
    }
  }
</script>

<style>
.login-page {
  padding: var(--space-md);
}

.login-page__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width: 768px){
  .login-page__actions {
    flex-direction: column;
  }
}
</style>