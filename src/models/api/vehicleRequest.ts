export type VehicleRequest = {
  vehicleId?: string,
  userId: string,
  make?: string,
  model?: string,
  year?: string,
  description?: string,
  color?: string,
  modificationCount?: number,
  modifiedAppearance?: boolean,
}