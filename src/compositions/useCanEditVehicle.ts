import { useRouteParam } from '@prefecthq/vue-compositions'
import { isLoggedIn } from '@/services/auth'

export function useCanEditVehicle(): boolean {
  const vehicleId = useRouteParam('vehicleId')

  return isLoggedIn() && !!vehicleId
}