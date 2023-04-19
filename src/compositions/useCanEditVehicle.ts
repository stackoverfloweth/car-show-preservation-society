import { useRouteParam } from '@prefecthq/vue-compositions'
import { currentUser } from '@/services/auth'

export function useCanEditVehicle(): boolean {
  const { userId } = currentUser
  const vehicleId = useRouteParam('vehicleId')

  return !!userId && !!vehicleId
}