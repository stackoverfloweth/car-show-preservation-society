<template>
  <div class="accept-invite-page">
    <p-card class="accept-invite-page__form-container">
      <PageHeader heading="Accept-invite" />
      <p-form class="accept-invite-page__form" @submit="accept">
        <AuthAcceptInviteFormFields v-model:values="values" />

        <div class="accept-invite-page__actions">
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
  import { useRouteParam, useValidationObserver } from '@prefecthq/vue-compositions'
  import { User } from 'gotrue-js'
  import { ref } from 'vue'
  import AuthAcceptInviteFormFields from '@/components/AuthAcceptInviteFormFields.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { AcceptInvitationRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { auth } from '@/services'

  const token = useRouteParam('token')
  const values = ref<Partial<AcceptInvitationRequest>>({})

  const { validate, pending } = useValidationObserver()

  async function accept(): Promise<User | undefined> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const { password, remember = false } = values.value as AcceptInvitationRequest

    return auth.acceptInvite(token.value, password, remember)
  }
</script>

<style>
.accept-invite-page {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.accept-invite-page__form-container {
  max-width: 640px;
  flex-grow: 1;
}

.accept-invite-page__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width: 768px){
  .accept-invite-page__actions {
    flex-direction: column;
  }
}
</style>