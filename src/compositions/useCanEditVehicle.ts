import { useRouteParam } from '@prefecthq/vue-compositions'
import { auth } from '@/services'

export function useCanEditVehicle(): boolean {
  const vehicleId = useRouteParam('vehicleId')

  return !!auth.currentUser() && !!vehicleId
}