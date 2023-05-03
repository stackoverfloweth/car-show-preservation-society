import { useRouteParam } from '@prefecthq/vue-compositions'
import { currentUser } from '@/services/auth'

export function useCanEditEvent(): boolean {
  const { userId } = currentUser
  const eventId = useRouteParam('eventId')

  return !!userId && !!eventId && false
}