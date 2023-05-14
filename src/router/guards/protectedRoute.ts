import { showToast } from '@prefecthq/prefect-design'
import { useLocalStorage } from '@prefecthq/vue-compositions'
import { routes } from '@/router/routes'
import { RouteGuard, isLoggedIn } from '@/services'

export const protectedRoute: RouteGuard = {
  before: (to) => {
    if (!isLoggedIn()) {
      const { set } = useLocalStorage('auth-redirect')
      set(to)
      showToast('Please login to access')
      return routes.login()
    }
  },
}