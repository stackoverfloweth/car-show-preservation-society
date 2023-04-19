import { useRouteParam } from '@prefecthq/vue-compositions'
import { currentUser } from '@/services/auth'

export function useCanEditClub(): boolean {
  const { userId } = currentUser
  const clubId = useRouteParam('clubId')

  return !!userId && !!clubId
}