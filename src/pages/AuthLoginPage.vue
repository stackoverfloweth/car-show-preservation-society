<template>
  <div class="login-page">
    <p-card class="login-page__form-container">
      <PageHeader heading="Login">
        <template #actions>
          <p-link :to="routes.signup()">
            Sign Up
          </p-link>
        </template>
      </PageHeader>
      <p-form class="login-page__form" @submit="login">
        <AuthLoginFormFields v-model:values="values" />

        <div class="login-page__actions">
          <p-button :to="routes.home()" inset>
            Cancel
          </p-button>
          <p-button type="submit" :loading="pending">
            Login
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
      const token = await auth.login(emailAddress, password, remember)
      console.log({ token })
    } catch (exception) {
      handleAuthError(exception, emailAddress)
    } finally {
      values.value.password = ''
    }
  }
</script>

<style>
.login-page {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.login-page__form-container {
  max-width: 640px;
  flex-grow: 1;
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