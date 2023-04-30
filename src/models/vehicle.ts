import { Image } from '@/models/image'

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
  image?: Image,
  images?: Image[],
}