import { useRouteParam } from '@prefecthq/vue-compositions'
import { isLoggedIn } from '@/services/auth'

export function useCanEditClub(): boolean {
  const clubId = useRouteParam('clubId')

  return isLoggedIn() && !!clubId
}