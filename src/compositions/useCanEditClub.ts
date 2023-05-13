import { useRouteParam } from '@prefecthq/vue-compositions'
import { isLoggedIn } from '@/services'

export function useCanEditClub(): boolean {
  const clubId = useRouteParam('clubId')

  return isLoggedIn() && !!clubId
}