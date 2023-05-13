import { useRouteParam } from '@prefecthq/vue-compositions'
import { isLoggedIn } from '@/services'

export function useCanEditEvent(): boolean {
  const eventId = useRouteParam('eventId')

  return isLoggedIn() && !!eventId && false
}