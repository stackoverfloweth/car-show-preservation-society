import { VehicleImage } from '@/models/vehicleImage'

export type Vehicle = {
  vehicleId: string,
  userId: string,
  make?: string,
  model?: string,
  year?: string,
  description?: string,
  color?: string,
  modificationCount?: number,
  modifiedAppearance?: boolean,
  images: VehicleImage[],
}