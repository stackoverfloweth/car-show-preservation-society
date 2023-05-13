import { useRouteParam } from '@prefecthq/vue-compositions'
import { auth } from '@/services'

export function useCanEditEvent(): boolean {
  const eventId = useRouteParam('eventId')

  return !!auth.currentUser() && !!eventId && false
}