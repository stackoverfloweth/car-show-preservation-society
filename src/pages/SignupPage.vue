<template>
  <div class="signup-page">
    <PageHeader heading="Sign Up" />
    <p-form class="signup-page__form" @submit="signup">
      <SignupFormFields v-model:values="values" />

      <p-link :to="routes.login()">
        Login
      </p-link>

      <div class="signup-page__actions">
        <p-button :to="routes.home()" inset>
          Cancel
        </p-button>
        <p-button type="submit" :loading="pending">
          Signup
        </p-button>
      </div>
    </p-form>
  </div>
</template>

<script lang="ts" setup>
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { User } from 'gotrue-js'
  import { ref } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
  import SignupFormFields from '@/components/SignupFormFields.vue'
  import { SignupRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { identifyApi } from '@/services'

  const values = ref<Partial<SignupRequest>>({})

  const { validate, pending } = useValidationObserver()

  async function signup(): Promise<User | undefined> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const { emailAddress, password } = values.value as SignupRequest

    return identifyApi.signUp(emailAddress, password)
  }
</script>

<style>
.signup-page {
  padding: var(--space-md);
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