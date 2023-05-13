import { showToast } from '@prefecthq/prefect-design'
import { useRouter } from 'vue-router'
import { useRouteHash } from '@/compositions/useRouteHash'
import { routes } from '@/router/routes'
import { auth } from '@/services'

export function useNetlifyAuthTokens(): void {
  const router = useRouter()

  const confirmToken = useRouteHash('confirmation_token')
  if (confirmToken.value) {
    showToast('Verifying...')

    auth.confirm(confirmToken.value).then(() => {
      showToast('Email Address confirmed!', 'success')
      router.push(routes.login())
    })
  }

  const inviteToken = useRouteHash('invite_token')
  if (inviteToken.value) {
    router.push(routes.accept(inviteToken.value))
  }
}