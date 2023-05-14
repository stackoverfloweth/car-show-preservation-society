import { showToast } from '@prefecthq/prefect-design'
import { routes } from '@/router/routes'
import { RouteGuard, isLoggedIn } from '@/services'

export const protectedRoute: RouteGuard = {
  before: () => {
    if (!isLoggedIn()) {
      showToast('Please login to access')
      return routes.login()
    }
  },
}