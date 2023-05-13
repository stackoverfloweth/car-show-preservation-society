import { showToast } from '@prefecthq/prefect-design'
import { useRouteQueryParam } from '@prefecthq/vue-compositions'
import { useRouter } from 'vue-router'
import { routes } from '@/router/routes'
import { auth } from '@/services'

export function useNetlifyAuthTokens(): void {
  const router = useRouter()

  const confirmToken = useRouteQueryParam('confirmation_token')
  if (confirmToken.value) {
    showToast('Verifying...')

    auth.verify('signup', confirmToken.value).then(() => {
      showToast('Email Address confirmed!', 'success')
      router.push(routes.login())
    })
  }

  const inviteToken = useRouteQueryParam('invite_token')
  if (inviteToken.value) {
    router.push(routes.accept(inviteToken.value))
  }
}