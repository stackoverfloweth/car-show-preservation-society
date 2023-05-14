import { showToast } from '@prefecthq/prefect-design'
import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteHash } from '@/compositions/useRouteHash'
import { routes } from '@/router/routes'
import { auth } from '@/services'

export function useNetlifyAuthTokens(): void {
  const router = useRouter()

  const confirmToken = useRouteHash('confirmation_token')
  const inviteToken = useRouteHash('invite_token')

  watchEffect(() => {
    if (confirmToken.value) {
      const verifyToast = showToast('Verifying...', 'default', { dismissible: false })

      auth.confirm(confirmToken.value).then(() => {
        verifyToast.dismiss()
        router.push(routes.login())
        showToast('Email Address confirmed!', 'success')
      })
    }

    if (inviteToken.value) {
      router.push(routes.accept(inviteToken.value))
    }
  })
}