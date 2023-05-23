<template>
  <div class="auth-confirm-page">
    <p-message v-if="token && !errored" class="auth-confirm-page__body">
      <LoadingEllipsis>
        Verifying
      </LoadingEllipsis>
    </p-message>
    <p-message v-else error class="auth-confirm-page__body">
      <div class="auth-confirm-page__error">
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
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import LoadingEllipsis from '@/components/LoadingEllipsis.vue'
  import { routes } from '@/router/routes'
  import { auth } from '@/services/auth'

  const router = useRouter()
  const token = useRouteParam('token')
  const errored = ref(false)

  if (token.value) {
    auth.confirm(token.value)
      .then(() => {
        router.push(routes.authLogin())
        showToast('Email Address confirmed!', 'success')
      })
      .catch(() => {
        errored.value = true
      })
  }
</script>

<style>
.auth-confirm-page {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.auth-confirm-page__body {
  text-align: center;
  font-size: var(--text-md);
}

.auth-confirm-page__error {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
</style>