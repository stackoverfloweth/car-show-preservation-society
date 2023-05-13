import { useRouteParam } from '@prefecthq/vue-compositions'
import { auth } from '@/services'

export function useCanEditClub(): boolean {
  const clubId = useRouteParam('clubId')

  return !!auth.currentUser() && !!clubId
}