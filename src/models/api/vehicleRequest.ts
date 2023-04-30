import { ImageRequest } from '@/models/api/imageRequest'

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
  image?: ImageRequest,
}